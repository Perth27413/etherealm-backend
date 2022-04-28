import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Land } from 'src/entities/land.entity';
import { OfferLand } from 'src/entities/offer-land.entity';
import { User } from 'src/entities/user.entity';
import DataNotFoundException from 'src/Exception/DataNotFoundException';
import { ValidateException } from 'src/Exception/ValidateException';
import CreateOfferLandRequestModel from 'src/model/offer/CreateOfferLandRequestModel';
import OfferLandPageRequestModel from 'src/model/offer/OfferLandPageRequestModel';
import OfferLandPageResponseModel from 'src/model/offer/OfferLandPageResponseModel';
import { Repository } from 'typeorm';
import { ContractService } from './contract.service';
import { LandService } from './land.service';
import { UserService } from './user.service';

@Injectable()
export class OfferLandService {

  constructor(
    @InjectRepository(OfferLand) private offerLandRepo: Repository<OfferLand>,
    private landService: LandService,
    private userService: UserService,
    private contractService: ContractService
  ) {}

  public async findAll(): Promise<Array<OfferLand>> {
    let result: Array<OfferLand> = await this.offerLandRepo.find()
    return result
  }

  public async findOfferLandByLandTokenId(request: OfferLandPageRequestModel): Promise<OfferLandPageResponseModel> {
    const pageItem: number = 2
    const [offers, total] = await this.offerLandRepo.findAndCount({
      where: {landTokenId: request.landTokenId, isDelete: false},
      order: {
        createAt: request.sortBy == 1 ? 'DESC' : 'ASC' // 1.) latest   2.) oldest  3.) highest price  4.) lowest price
      },
      relations: ['fromUserTokenId', 'landTokenId'],
      skip: (request.page * pageItem) - pageItem,
      take: pageItem
    })
    if (!offers.length) {
      throw new DataNotFoundException
    }
    if (request.sortBy > 4) {
      throw new ValidateException('Sort Type is invalid.')
    }
    if (request.sortBy > 2) {
      if (request.sortBy == 3) {
        offers.sort((a, b) => b.offerPrice - a.offerPrice)
      }
      if (request.sortBy == 4) {
        offers.sort((a, b) => a.offerPrice - b.offerPrice)
      }
    }
    const result: OfferLandPageResponseModel = {
      currentPage: request.page,
      pageItem: pageItem,
      totalPage: Math.ceil(total / pageItem),
      data: offers
    }
    return result
  }

  public async createOffer(request: CreateOfferLandRequestModel): Promise<OfferLand> {
    // check point on smart contract
    await this.contractService.getPointsFromUserTokenId(request.requestUserTokenId)
    if (request.offerPrice < 0.00001) {
      throw new ValidateException('Offer Price is invalid')
    }
    const data: OfferLand = await this.createOfferRequestToOfferLand(request)
    const result: OfferLand = await this.offerLandRepo.save(data)
    return result
  }

  private async createOfferRequestToOfferLand(request: CreateOfferLandRequestModel): Promise<OfferLand> {
    const land: Land = await this.landService.findLandEntityByTokenId(request.landTokenId)
    const user: User = await this.userService.findUserByTokenId(request.requestUserTokenId)
    if (!land || !user) {
      throw new DataNotFoundException
    }
    const currentDate: Date = new Date()
    const result: OfferLand = {
      offerId: null,
      fromUserTokenId: user,
      landTokenId: land,
      offerPrice: request.offerPrice,
      fees: (request.offerPrice * 2.5) / 100,
      isEnoughPoint: true,
      isDelete: false,
      createAt: currentDate,
      updatedAt: currentDate
    }
    return result
  }

}
