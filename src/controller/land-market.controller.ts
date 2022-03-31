import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LandMarket } from 'src/entities/land-market.entity';
import LandMarketRequestModel from 'src/model/market/LandMarketRequestModel';
import { LandMarketService } from 'src/service/land-market.service';

@Controller('api/market')
export class LandMarketController {
  constructor(private readonly landMarketService: LandMarketService) {}

  @Get('/land')
  public async getAll(): Promise<Array<LandMarket>> {
    let lands: Array<LandMarket> = await this.landMarketService.findAll()
    return lands
  }

  @Post('/land/create')
  public async createLandToMarket(@Body() request: LandMarketRequestModel): Promise<LandMarket> {
    let land: LandMarket = await this.landMarketService.addLandToLandMarket(request)
    return land
  }

}
