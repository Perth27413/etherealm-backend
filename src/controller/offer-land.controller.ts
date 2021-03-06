import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import OfferLandModel from 'src/model/offer/OfferLandModel';
import { OfferLand } from 'src/entities/offer-land.entity';
import { OfferLandService } from 'src/service/offer-land.service';
import OfferLandPageRequestModel from 'src/model/offer/OfferLandPageRequestModel';
import OfferLandPageResponseModel from 'src/model/offer/OfferLandPageResponseModel';
import CreateOfferLandRequestModel from 'src/model/offer/CreateOfferLandRequestModel';
import CancelOfferLandRequestModel from 'src/model/offer/CancelOfferLandRequestModel';
import OfferingLandPageRequestModel from 'src/model/offer/OfferingLandPageRequestModel';
import IsOfferLandRequestModel from 'src/model/offer/IsOfferLandRequestModel';
import { Headers } from '@nestjs/common';
import ConfirmOfferLandRequestModel from 'src/model/offer/ConfirmOfferLandRequestModel';

@Controller('api/offers')
export default class OfferLandController {
  constructor(private readonly offerLandService: OfferLandService) {}

  @Get()
  public async findAll(): Promise<Array<OfferLand>> {
    let offerLand: Array<OfferLand> = await this.offerLandService.findAll()
    return offerLand
  }

  @Post('/user/land')
  public async findIsOfferLandByTokenId(@Body() request: IsOfferLandRequestModel): Promise<OfferLand> {
    let offerLand: OfferLand = await this.offerLandService.getIsOfferLandByUserTokenId(request)
    return offerLand
  }

  @Post('/confirm')
  public async confirmOfferLand(@Body() request: ConfirmOfferLandRequestModel, @Headers() headers): Promise<string> {
    const owner: string = headers['authorization']
    let result: string = await this.offerLandService.confirmLand(request, owner)
    return result
  }

  @Patch('/page')
  public async findOfferByLandTokenId(@Body() request: OfferLandPageRequestModel): Promise<OfferLandPageResponseModel> {
    const results: OfferLandPageResponseModel = await this.offerLandService.findOfferLandByLandTokenId(request)
    return results
  }

  @Post('/create')
  public async createOfferLand(@Body() request: CreateOfferLandRequestModel): Promise<OfferLand> {
    const result: OfferLand = await this.offerLandService.createOffer(request)
    return result
  }

  @Patch('/cancel')
  public async cancelOfferLand(@Body() request: CancelOfferLandRequestModel): Promise<OfferLand> {
    const result: OfferLand = await this.offerLandService.cancelOffer(request)
    return result
  }

  @Patch('/user/page')
  public async findOfferingByUserTokenId(@Body() request: OfferingLandPageRequestModel): Promise<OfferLandPageResponseModel> {
    const results: OfferLandPageResponseModel = await this.offerLandService.findOfferingLandByUserTokenId(request)
    return results
  }
  
}