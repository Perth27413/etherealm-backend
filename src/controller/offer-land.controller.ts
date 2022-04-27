import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import OfferLandModel from 'src/model/offer/OfferLandModel';
import { OfferLand } from 'src/entities/offer-land.entity';
import { OfferLandService } from 'src/service/offer-land.service';

@Controller('api/offer')
export default class OfferLandController {
  constructor(private readonly offerLandService: OfferLandService) {}

  @Get()
  public async findAll(): Promise<Array<OfferLand>> {
    let offerLand: Array<OfferLand> = await this.offerLandService.findAll()
    return offerLand
  }
  
}