import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Land } from '../entities/land.entity';
import { LandService } from '../service/land.service';

@Controller('api/land')
export class LandController {
  constructor(private readonly landService: LandService) {}

  @Get()
  public async findAll(): Promise<Array<Land>> {
    let allLands: Array<Land> = await this.landService.findAll()
    return allLands
  }

}
