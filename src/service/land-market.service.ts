import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LandMarket } from 'src/entities/land-market.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LandMarketService {

  constructor(
    @InjectRepository(LandMarket) private landMarketRepo: Repository<LandMarket>
  ) {}

  public async findAll(): Promise<Array<LandMarket>> {
    let result: Array<LandMarket> = await this.landMarketRepo.find()
    return result
  }

}
