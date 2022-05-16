import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentLand } from 'src/entities/rent-land.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RentLandService {

  constructor(
    @InjectRepository(RentLand) private rentLandRepo: Repository<RentLand>
  ) {}

  public async findAll(): Promise<Array<RentLand>> {
    let result: Array<RentLand> = await this.rentLandRepo.find()
    return result
  }

}
