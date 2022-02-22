import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LandStatusService } from '../service/land-status.service';

@Controller('api/land/status')
export class LandStatusController {
  constructor(private readonly landStatusService: LandStatusService) {}

  @Get()
  findAll() {
    return this.landStatusService.findAll();
  }
}
