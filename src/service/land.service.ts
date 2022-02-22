import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Land } from '../entities/land.entity';

@Injectable()
export class LandService {

  constructor(
    @InjectRepository(Land) private landRepo: Repository<Land>
  ) {}

  public async findAll(): Promise<Array<Land>> {
    let allLands: Array<Land> = await this.landRepo.find({relations: ["landStatus"]})
    return allLands
  }

}
