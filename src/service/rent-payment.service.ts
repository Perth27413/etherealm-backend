import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogTransactions } from 'src/entities/log-transactions.entity';
import { RentLand } from 'src/entities/rent-land.entity';
import { RentPayment } from 'src/entities/rent-payment.entity';
import AddRentPaymentRequestModel from 'src/model/rent/AddRentPaymentRequestModel';
import { Repository } from 'typeorm';
import { LogTransactionsService } from './log-transactions.service';
import { UserService } from './user.service';

@Injectable()
export class RentPaymentService {

  constructor(
    @InjectRepository(RentPayment) private rentPaymentRepo: Repository<RentPayment>,
    private userService: UserService
  ) {}

  public async findAll(): Promise<Array<RentPayment>> {
    let result: Array<RentPayment> = await this.rentPaymentRepo.find()
    return result
  }

  public async findPaymentByLandAndOwnerTokenId(rentId: number, renterTokenId: string): Promise<Array<RentPayment>> {
    const results: Array<RentPayment> = await this.rentPaymentRepo.find({where: {rentId: rentId, renterTokenId: renterTokenId}, relations: ['rentId', 'logTransactionsId', 'renterTokenId']})
    return results
  }

  public async addPaymentFromRentLand(request: AddRentPaymentRequestModel, rent: RentLand, transaction: LogTransactions): Promise<RentPayment> {
    const saveData: RentPayment = await this.mapAddRentPaymentRequestToRentPaymentEntity(request, rent, transaction)
    const result: RentPayment = await this.rentPaymentRepo.save(saveData)
    return result
  }

  private async mapAddRentPaymentRequestToRentPaymentEntity(request: AddRentPaymentRequestModel, rent: RentLand, transaction: LogTransactions): Promise<RentPayment> {
    const currentDate: Date = new Date()
    const result: RentPayment = {
      rentPaymentId: null,
      rentId: rent,
      logTransactionsId: transaction,
      price: request.price,
      fees: request.price * 0.025,
      createAt: currentDate,
      updatedAt: currentDate,
      renterTokenId: await this.userService.findUserByTokenId(request.renterTokenId)
    }
    return result
  }
}
