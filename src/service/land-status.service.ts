import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LandStatus } from 'src/entities/land-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LandStatusService {

  constructor(
    @InjectRepository(LandStatus) private landStatusRepo: Repository<LandStatus>
  ) {}

  public async findStatusById(statusId: number): Promise<LandStatus> {
    let status: LandStatus = await this.landStatusRepo.findOne(statusId)
    return status
  }

}
