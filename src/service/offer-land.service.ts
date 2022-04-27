import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferLand } from 'src/entities/offer-land.entity';
import DataNotFoundException from 'src/Exception/DataNotFoundException';
import { ValidateException } from 'src/Exception/ValidateException';
import OfferLandPageRequestModel from 'src/model/offer/OfferLandPageRequestModel';
import OfferLandPageResponseModel from 'src/model/offer/OfferLandPageResponseModel';
import { Repository } from 'typeorm';

@Injectable()
export class OfferLandService {

  constructor(
    @InjectRepository(OfferLand) private offerLandRepo: Repository<OfferLand>
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

}
