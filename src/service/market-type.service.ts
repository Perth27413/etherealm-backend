import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarketType } from 'src/entities/market-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MarketTypeService {

  constructor(
    @InjectRepository(MarketType) private marketTypeRepo: Repository<MarketType>
  ) {}

  public async findAll(): Promise<Array<MarketType>> {
    let result: Array<MarketType> = await this.marketTypeRepo.find()
    return result
  }

}
