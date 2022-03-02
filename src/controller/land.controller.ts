import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import LandRequestModel from 'src/model/lands/LandRequestModel';
import LandResponseModel from 'src/model/lands/LandResponseModel';
import PurchaseLandRequestModel from 'src/model/lands/PurchaseLandRequestModel';
import { Land } from '../entities/land.entity';
import { LandService } from '../service/land.service';

@Controller('api/lands')
export class LandController {
  constructor(private readonly landService: LandService) {}

  @Get()
  public async findAll(): Promise<Array<LandResponseModel>> {
    let allLands: Array<LandResponseModel> = await this.landService.findAll()
    return allLands
  }

  @Get('/land/:tokenId')
  public async findByTokenId(@Param("tokenId") tokenId: string): Promise<LandResponseModel> {
    let land: LandResponseModel = await this.landService.findLandByTokenId(tokenId)
    return land
  }

  @Get('ownerTokenId')
  public async findByOwnerTokenId(@Query("ownerTokenId") ownerTokenId: string): Promise<Array<LandResponseModel>> {
    let land: Array<LandResponseModel> = await this.landService.findLandByOwnerTokenId(ownerTokenId)
    return land
  }

  @Post('/purchase')
  public async purchaseLand(@Body() purchaseLandRequest: PurchaseLandRequestModel): Promise<LandResponseModel> {
    let land: LandResponseModel = await this.landService.purchaseLand(purchaseLandRequest)
    return land
  }

  @Post('/land/update')
  public async updateLand(@Body() landRequest: LandRequestModel): Promise<LandResponseModel> {
    let land: LandResponseModel = await this.landService.updateLand(landRequest)
    return land
  }

  @Post('/generate')
  public async generateLands(): Promise<string> {
    let message: string = await this.landService.generateLands()
    return message
  }

  @Post()
  public async insertLand(@Body() landRequest: LandRequestModel): Promise<Land> {
    let land: Land = await this.landService.insertLand(landRequest)
    return land
  }

}
