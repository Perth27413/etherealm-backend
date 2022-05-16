import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HirePurchasePayment } from 'src/entities/hire-purchase-payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HirePurchasePaymentService {

  constructor(
    @InjectRepository(HirePurchasePayment) private hirePurchasePaymentRepo: Repository<HirePurchasePayment>
  ) {}

  public async findAll(): Promise<Array<HirePurchasePayment>> {
    let result: Array<HirePurchasePayment> = await this.hirePurchasePaymentRepo.find()
    return result
  }

}
