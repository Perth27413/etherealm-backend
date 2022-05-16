import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentLand } from 'src/entities/rent-land.entity';
import { RentPayment } from 'src/entities/rent-payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RentPaymentService {

  constructor(
    @InjectRepository(RentPayment) private rentPaymentRepo: Repository<RentPayment>
  ) {}

  public async findAll(): Promise<Array<RentPayment>> {
    let result: Array<RentPayment> = await this.rentPaymentRepo.find()
    return result
  }

}
