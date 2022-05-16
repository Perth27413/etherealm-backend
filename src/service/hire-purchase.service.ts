import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HirePurchase } from 'src/entities/hire-purchase.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HirePurchaseService {

  constructor(
    @InjectRepository(HirePurchase) private hirePurchaseRepo: Repository<HirePurchase>
  ) {}

  public async findAll(): Promise<Array<HirePurchase>> {
    let result: Array<HirePurchase> = await this.hirePurchaseRepo.find()
    return result
  }

}
