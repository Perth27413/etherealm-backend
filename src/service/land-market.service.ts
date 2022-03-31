import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LandMarket } from 'src/entities/land-market.entity';
import { Land } from 'src/entities/land.entity';
import { MarketType } from 'src/entities/market-type.entity';
import { User } from 'src/entities/user.entity';
import { ValidateException } from 'src/Exception/ValidateException';
import LandResponseModel from 'src/model/lands/LandResponseModel';
import BuyLandOnMarketRequestModel from 'src/model/market/BuyLandOnMarketRequestModel';
import LandMarketRequestModel from 'src/model/market/LandMarketRequestModel';
import { Repository } from 'typeorm';
import { LandService } from './land.service';
import { MarketTypeService } from './market-type.service';
import { UserService } from './user.service';

@Injectable()
export class LandMarketService {

  constructor(
    @InjectRepository(LandMarket) private landMarketRepo: Repository<LandMarket>,
    private landService: LandService,
    private userService: UserService,
    private marketTypeService: MarketTypeService
  ) {}

  public async findAll(): Promise<Array<LandMarket>> {
    let result: Array<LandMarket> = await this.landMarketRepo.find({relations: ['landTokenId', 'ownerUserTokenId', 'marketType']})
    return result
  }

  public async addLandToLandMarket(request: LandMarketRequestModel): Promise<LandMarket> {
    const exists: LandMarket = await this.landMarketRepo.findOne({where: {landTokenId: request.landTokenId}})
    if (exists) {
      throw new ValidateException('Land is already listed on market.')
    }
    const data: LandMarket = await this.mapLandMarketRequestModelToLandMarket(request)
    let result: LandMarket = await this.landMarketRepo.save(data)
    const statusId: number = request.marketType === 1 ? 3 : 4
    await this.landService.updateLandStatus(request.landTokenId, statusId)
    return result
  }

  public async buyLandOnMarket(request: BuyLandOnMarketRequestModel): Promise<LandResponseModel> {
    const land: LandResponseModel = await this.landService.transferLand(request.fromUserTokenId, request.toUserTokenId, request.landUserTokenId)
    if (land) {
      const landOnMarket: LandMarket = await this.landMarketRepo.findOne({where: {landTokenId: request.landUserTokenId}, relations: ['landTokenId', 'ownerUserTokenId', 'marketType']})
      if (landOnMarket.ownerUserTokenId.userTokenId === request.fromUserTokenId) {
        await this.landMarketRepo.delete(landOnMarket)
        return land
      } else {
        throw new ValidateException('Land owner is invalid.')
      }
    }
  }

  private async mapLandMarketRequestModelToLandMarket(request: LandMarketRequestModel): Promise<LandMarket> {
    const land: Land = await this.landService.findLandEntityByTokenId(request.landTokenId)
    const owner: User = await this.userService.findUserByTokenId(request.ownerUserTokenId)
    const marketType: MarketType = await this.marketTypeService.findTypeById(request.marketType)
    let result: LandMarket = {
      landTokenId: land,
      ownerUserTokenId: owner,
      period: request.period,
      price: request.price,
      marketType: marketType,
      landMarketId: null
    }
    return result
  }

}
