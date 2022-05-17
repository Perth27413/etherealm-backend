import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { Headers } from '@nestjs/common';
import { HirePurchaseService } from 'src/service/hire-purchase.service';
import AddHirePurchaseRequestModel from 'src/model/lands/hire-purchase/AddHirePurchaseRequestModel';
import HirePurchaseResponseModel from 'src/model/lands/hire-purchase/HirePurchaseResponseModel';
import { HirePurchase } from 'src/entities/hire-purchase.entity';
import OwnedHirePurchaseResponseModel from 'src/model/lands/hire-purchase/OwnedHirePurchaseResponseModel';

@Controller('api/lands/hire')
export default class HirePurchaseLandController {
  constructor(private readonly hirePurchaseService: HirePurchaseService) {}

  @Get('/details/:landTokenId')
  public async getRentLandDetails(@Param('landTokenId') landTokenId: string): Promise<HirePurchaseResponseModel> {
    let results: HirePurchaseResponseModel = await this.hirePurchaseService.getHirePurchaseDetails(landTokenId)
    return results
  }

  @Get('/owned')
  public async getHirePurchaseByRenterTokenId(@Query('renterTokenId') renterTokenId: string): Promise<Array<OwnedHirePurchaseResponseModel>> {
    let results: Array<OwnedHirePurchaseResponseModel> = await this.hirePurchaseService.findHirePurchaseByRenterTokenId(renterTokenId)
    return results
  }

  @Post()
  public async addRentLand(@Body() request: AddHirePurchaseRequestModel, @Headers() headers): Promise<HirePurchase> {
    const owner: string = headers['authorization']
    let results: HirePurchase = await this.hirePurchaseService.addHirePurchase(request, owner)
    return results
  }
}