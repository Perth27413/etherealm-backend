import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { HirePurchase } from 'src/entities/hire-purchase.entity';
import { Land } from 'src/entities/land.entity';
import { LogTransactions } from 'src/entities/log-transactions.entity';
import { ValidateException } from 'src/Exception/ValidateException';
import AddHirePurchasePaymentRequestModel from 'src/model/lands/hire-purchase/AddHirePurchasePaymentRequestModel';
import AddHirePurchaseRequestModel from 'src/model/lands/hire-purchase/AddHirePurchaseRequestModel';
import HirePurchaseResponseModel from 'src/model/lands/hire-purchase/HirePurchaseResponseModel';
import OwnedHirePurchaseResponseModel from 'src/model/lands/hire-purchase/OwnedHirePurchaseResponseModel';
import TransactionsRequestModel from 'src/model/transactions/TransactionsRequestModel';
import { Repository } from 'typeorm';
import { ContractService } from './contract.service';
import { HirePurchasePaymentService } from './hire-purchase-payment.service';
import { LandService } from './land.service';
import { LogTransactionsService } from './log-transactions.service';
import { UserService } from './user.service';

@Injectable()
export class HirePurchaseService {

  constructor(
    @InjectRepository(HirePurchase) private hirePurchaseRepo: Repository<HirePurchase>,
    private contractService: ContractService,
    private landService: LandService,
    private userService: UserService,
    private logTransactionService: LogTransactionsService,
    private hirePurchasePaymentService: HirePurchasePaymentService
  ) {}

  public async findAll(): Promise<Array<HirePurchase>> {
    let result: Array<HirePurchase> = await this.hirePurchaseRepo.find()
    return result
  }

  public async findHirePurchaseByRenterTokenId(renterTokenId: string): Promise<Array<OwnedHirePurchaseResponseModel>> {
    const hirePurchase: Array<HirePurchase> = await this.hirePurchaseRepo.find({where: {renterTokenId: renterTokenId, isDelete: false}, relations: ['landTokenId', 'renterTokenId']})
    return this.mapHirePurchaseToOwnedHirePurchaseResponse(hirePurchase)
  }

  public async getHirePurchaseDetails(landTokenId: string): Promise<HirePurchaseResponseModel> {
    const hirePurchase: HirePurchase = await this.hirePurchaseRepo.findOne({where: {landTokenId: landTokenId, isDelete: false}, relations: ['landTokenId', 'renterTokenId']})
    if (hirePurchase) {
      const result: HirePurchaseResponseModel = await this.mapHirePurchaseToHirePurchaseResponse(hirePurchase)
      return result
    }
    return new HirePurchaseResponseModel
  }

  public async addHirePurchase(request: AddHirePurchaseRequestModel, renterTokenId: string): Promise<HirePurchase> {
    const land: Land = await this.landService.findLandEntityByLandTokenIdAndLandStatus(request.landTokenId, 1)
    if (!land) {
      throw new ValidateException('Land Token is invalid.')
    }
    const isExists: HirePurchase = await this.hirePurchaseRepo.findOne({where: {landTokenId: request.landTokenId, isDelete: false}})
    if (isExists) {
      throw new ValidateException('This Land is already hiring.')
    }
    await this.landService.updateLandStatus(request.landTokenId, 0)
    const receipt = await this.contractService.getTransaction(request.hash)
    if (receipt.status) {
      //change land status
      await this.landService.updateLandStatus(request.landTokenId, 6)

      //map request to entitiy
      const saveData: HirePurchase = await this.mapAddHirePurchaseRequestToEntity(request, renterTokenId)
      const hirePurchaseResponse = await this.hirePurchaseRepo.save(saveData)
      
      //add transaction
      const transactionRequestModel: TransactionsRequestModel = this.mapReceiptToTransactionRequestModel(receipt, renterTokenId, 5)
      const transactionResult: LogTransactions = await this.logTransactionService.addTransactionReturnEntity(transactionRequestModel)

      //add hire purchase payment
      const hirePurchasePaymentRequest: AddHirePurchasePaymentRequestModel = {
        hirePurchase: hirePurchaseResponse,
        logTransactions: transactionResult,
        renter: await this.userService.findUserByTokenId(renterTokenId),
        price: request.price
      }
      await this.hirePurchasePaymentService.addHirePurchasePayment(hirePurchasePaymentRequest)

      return hirePurchaseResponse
    } else {
      await this.landService.updateLandStatus(request.landTokenId, 1)
    }
  }

  private async mapHirePurchaseToOwnedHirePurchaseResponse(rentLands: Array<HirePurchase>): Promise<Array<OwnedHirePurchaseResponseModel>> {
    const results: Array<OwnedHirePurchaseResponseModel> = []
    for await (const item of rentLands) {
      const data: OwnedHirePurchaseResponseModel = {
        ...item,
        landTokenId: await this.landService.mapLandToLandResponseModel(item.landTokenId)
      }
      results.push(data)
    }
    return results
  }

  private async mapHirePurchaseToHirePurchaseResponse(hirePurchase: HirePurchase): Promise<HirePurchaseResponseModel> {
    const result: HirePurchaseResponseModel = {
      ...hirePurchase,
      nextPayment: this.calculateNextPayment(hirePurchase.endDate, hirePurchase.period),
      paymentHistories: await this.hirePurchasePaymentService.findPaymentByHirePurchaseIdAndRenterTokenId(hirePurchase.hirePurchaseId, hirePurchase.renterTokenId.userTokenId)
    }
    return result
  }

  private checkIsLastPayment(endDate: Date): boolean {
    const currentDate: Date = new Date()
    if (currentDate <= endDate) {
      return false
    }
    return true
  }

  private calculateNextPayment(endDate: Date, period: number): Date {
    if (!this.checkIsLastPayment(endDate)) {
      let currentDate: Date = new Date()
      if (period > 14) {
        currentDate.setMonth(currentDate.getMonth() + 1)
        return currentDate
      }
    }
    return null
  }

  private mapReceiptToTransactionRequestModel(receipt: ethers.providers.TransactionReceipt, ownerTokenId: string, type: number): TransactionsRequestModel {
    const result: TransactionsRequestModel = {
      fromUserTokenId: receipt.from,
      toUserTokenId: ownerTokenId,
      logType: type,
      transactionBlock: receipt.transactionHash,
      gasPrice: Number(ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)))
    }
    return result
  }

  private async mapAddHirePurchaseRequestToEntity(request: AddHirePurchaseRequestModel, renterTokenId: string): Promise<HirePurchase> {
    const currentDate: Date = new Date()
    const result: HirePurchase = {
      hirePurchaseId: null,
      landTokenId: await this.landService.findLandEntityByTokenId(request.landTokenId),
      renterTokenId: await this.userService.findUserByTokenId(renterTokenId),
      period: request.period,
      price: request.price,
      fees: request.fees,
      createAt: currentDate,
      updatedAt: currentDate,
      startDate: request.startDate,
      endDate: request.endDate,
      // endDate: this.calculateEndDate(currentDate, request.period),
      lastPayment: currentDate,
      isDelete: false,
    }
    return result
  }

  private calculateEndDate(date: Date, period: number) {
    let newDate = new Date(date)
    if (period > 14) {
      const monthLength: number = period / 30
      newDate.setMonth(date.getMonth() + monthLength)
    } else {
      newDate.setDate(date.getDate() + period)
    }
    return newDate
  }

}
