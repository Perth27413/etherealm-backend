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
import { RentLandService } from 'src/service/rent-land.service';
import RentLandDetailsResponseModel from 'src/model/rent/RentLandDetailsResponseModel';
import AddRentLandRequestModel from 'src/model/rent/AddRentLandRequestModel';
import { RentLand } from 'src/entities/rent-land.entity';

@Controller('api/lands/rent')
export default class RentLandController {
  constructor(private readonly rentLandService: RentLandService) {}

  @Get('/details/:landTokenId')
  public async getRentLandDetails(@Param('landTokenId') landTokenId: string): Promise<RentLandDetailsResponseModel> {
    let results: RentLandDetailsResponseModel = await this.rentLandService.getRentDetails(landTokenId)
    return results
  }

  @Post()
  public async addRentLand(@Body() request: AddRentLandRequestModel, @Headers() headers): Promise<RentLand> {
    const owner: string = headers['authorization']
    let results: RentLand = await this.rentLandService.addRentLand(request, owner)
    return results
  }
}