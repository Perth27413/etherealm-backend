import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import LandRequestModel from 'src/model/lands/LandRequestModel';
import { Land } from '../entities/land.entity';
import { LandService } from '../service/land.service';

@Controller('api/lands')
export class LandController {
  constructor(private readonly landService: LandService) {}

  @Get()
  public async findAll(): Promise<Array<Land>> {
    let allLands: Array<Land> = await this.landService.findAll()
    return allLands
  }

  @Get('/:tokenId')
  public async findByTokenId(@Param("tokenId") tokenId: string): Promise<Land> {
    let land: Land = await this.landService.findLandByTokenId(tokenId)
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
