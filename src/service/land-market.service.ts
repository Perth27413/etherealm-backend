import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LandMarket } from 'src/entities/land-market.entity';
import { Land } from 'src/entities/land.entity';
import { MarketType } from 'src/entities/market-type.entity';
import { User } from 'src/entities/user.entity';
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
    const data: LandMarket = await this.mapLandMarketRequestModelToLandMarket(request)
    let result: LandMarket = await this.landMarketRepo.save(data)
    return result
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
