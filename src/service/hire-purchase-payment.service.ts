import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HirePurchasePayment } from 'src/entities/hire-purchase-payment.entity';
import AddHirePurchasePaymentRequestModel from 'src/model/lands/hire-purchase/AddHirePurchasePaymentRequestModel';
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

  public async findPaymentByHirePurchaseIdAndRenterTokenId(hirePurchaseId: number, renterTokenId: string): Promise<Array<HirePurchasePayment>> {
    const result: Array<HirePurchasePayment> = await this.hirePurchasePaymentRepo.find({where: {hirePurchaseId: hirePurchaseId, renterTokenId: renterTokenId}, relations: ['logTransactionsId']})
    return result
  }

  public async addHirePurchasePayment(request: AddHirePurchasePaymentRequestModel): Promise<HirePurchasePayment> {
    const saveData = this.mapAddHirePurchasePaymentRequestToEntity(request)
    const result: HirePurchasePayment = await this.hirePurchasePaymentRepo.save(saveData)
    return result
  }

  private mapAddHirePurchasePaymentRequestToEntity(request: AddHirePurchasePaymentRequestModel): HirePurchasePayment {
    const currentDate: Date = new Date()
    const result: HirePurchasePayment = {
      fees: request.price * 0.025,
      createAt: currentDate,
      updatedAt: currentDate,
      hirePurchasePaymentId: null,
      hirePurchaseId: request.hirePurchase,
      logTransactionsId: request.logTransactions,
      renterTokenId: request.renter,
      price: request.price
    }
    return result
  }

}
