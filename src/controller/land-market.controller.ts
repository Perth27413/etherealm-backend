import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LandMarket } from 'src/entities/land-market.entity';
import LandResponseModel from 'src/model/lands/LandResponseModel';
import BuyLandOnMarketRequestModel from 'src/model/market/BuyLandOnMarketRequestModel';
import LandMarketPageRequestModel from 'src/model/market/LandMarketPageRequestModel';
import LandMarketPageResponseModel from 'src/model/market/LandMarketPageResponseModel';
import LandMarketRequestModel from 'src/model/market/LandMarketRequestModel';
import RemoveLandOnMarketRequest from 'src/model/market/RemoveLandOnMarketRequest';
import UpdateLandPriceOnMarketRequestModel from 'src/model/market/UpdateLandPriceOnMarketRequestModel';
import { LandMarketService } from 'src/service/land-market.service';

@Controller('api/market')
export class LandMarketController {
  constructor(private readonly landMarketService: LandMarketService) {}

  @Get('/land')
  public async getAll(): Promise<Array<LandMarket>> {
    let lands: Array<LandMarket> = await this.landMarketService.findAll()
    return lands
  }

  @Patch('/land')
  public async getByMarketTypeId(@Body() request: LandMarketPageRequestModel): Promise<LandMarketPageResponseModel> {
    let lands: LandMarketPageResponseModel = await this.landMarketService.findByMarketTypeId(request)
    return lands
  }

  @Post('/land/create')
  public async createLandToMarket(@Body() request: LandMarketRequestModel): Promise<LandMarket> {
    let land: LandMarket = await this.landMarketService.addLandToLandMarket(request)
    return land
  }

  @Post('/land/buy')
  public async buyLandAndMarket(@Body() request: BuyLandOnMarketRequestModel): Promise<LandResponseModel> {
    let land: LandResponseModel = await this.landMarketService.buyLandOnMarket(request)
    return land
  }

  @Post('/land/remove')
  public async removeLandOnMarket(@Body() request: RemoveLandOnMarketRequest): Promise<string> {
    const result: string = await this.landMarketService.removeFromMarket(request)
    return result
  }

  @Post('/land/update/price')
  public async updateLandPriceOnMarket(@Body() request: UpdateLandPriceOnMarketRequestModel): Promise<LandMarket> {
    const result: LandMarket = await this.landMarketService.updateLandPriceOnMarket(request)
    return result
  }

}
