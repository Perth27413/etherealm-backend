import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers, Transaction } from 'ethers';
import { LandMarket } from 'src/entities/land-market.entity';
import { Land } from 'src/entities/land.entity';
import { LogTransactions } from 'src/entities/log-transactions.entity';
import { Notifications } from 'src/entities/notifications.entity';
import { RentLand } from 'src/entities/rent-land.entity';
import { ValidateException } from 'src/Exception/ValidateException';
import CoordinatesModel from 'src/model/lands/CoordinatesModel';
import LandResponseModel from 'src/model/lands/LandResponseModel';
import RemoveLandOnMarketRequest from 'src/model/market/RemoveLandOnMarketRequest';
import NotificationsRequestModel from 'src/model/notifications/NotificationsRequestModel';
import AddRentLandRequestModel from 'src/model/rent/AddRentLandRequestModel';
import AddRentPaymentRequestModel from 'src/model/rent/AddRentPaymentRequestModel';
import OwnedRentLandResponseModel from 'src/model/rent/OwnedRentLandResponseModel';
import RentLandDetailsResponseModel from 'src/model/rent/RentLandDetailsResponseModel';
import TransactionsRequestModel from 'src/model/transactions/TransactionsRequestModel';
import TransactionsResponseModel from 'src/model/transactions/TransactionsResponseModel';
import { Repository } from 'typeorm';
import { ContractService } from './contract.service';
import { LandMarketService } from './land-market.service';
import { LandService } from './land.service';
import { LogTransactionsService } from './log-transactions.service';
import { NotificationsService } from './notifications.service';
import { OfferLandService } from './offer-land.service';
import { PeriodTypeService } from './period-type.service';
import { RentPaymentService } from './rent-payment.service';
import { RentTypeService } from './rent-type.service';
import { UserService } from './user.service';

@Injectable()
export class RentLandService {

  constructor(
    @InjectRepository(RentLand) private rentLandRepo: Repository<RentLand>,
    private landService: LandService,
    private rentTypeService: RentTypeService,
    private periodTypeService: PeriodTypeService,
    private logTransactionService: LogTransactionsService,
    private contractService: ContractService,
    private notificationService: NotificationsService,
    private rentPaymentService: RentPaymentService,
    private userService: UserService,
    private landMarketService: LandMarketService,
    private offerLandService: OfferLandService
  ) {}

  public async findAll(): Promise<Array<RentLand>> {
    let result: Array<RentLand> = await this.rentLandRepo.find()
    return result
  }

  public async getPeopleAreRentingByLandOwnerTokenId(landOwnerTokenId: string): Promise<Array<OwnedRentLandResponseModel>> {
    const result: Array<RentLand> = await this.rentLandRepo.find({where: {isDelete: false}, relations: ['landTokenId', 'rentType', 'periodType', 'renterTokenId']})
    const validResult: Array<RentLand> = []
    for (const item of result) {
      if (item.landTokenId.landOwnerTokenId === landOwnerTokenId) {
        validResult.push(item)
      }
    }
    return this.mapRentLandToOwnedRentLandResponse(validResult)
  }

  public async findRentLandByRenterTokenId(renterTokenId: string): Promise<Array<OwnedRentLandResponseModel>> {
    const result: Array<RentLand> = await this.rentLandRepo.find({where: {isDelete: false, renterTokenId: renterTokenId}, relations: ['landTokenId', 'rentType', 'periodType', 'renterTokenId']})
    return this.mapRentLandToOwnedRentLandResponse(result)
  }

  public async getRentDetails(landTokenId: string): Promise<RentLandDetailsResponseModel> {
    let rentLand: RentLand = await this.rentLandRepo.findOne({where: {landTokenId: landTokenId, isDelete: false}, relations: ['landTokenId', 'rentType', 'periodType', 'renterTokenId']})
    if (rentLand) {
      const result: RentLandDetailsResponseModel = await this.mapRentLandToRentLandDetailsResponse(rentLand)
      return result
    }
    return new RentLandDetailsResponseModel
  }

  public async addRentLand(request: AddRentLandRequestModel, userTokenId: string): Promise<RentLand> {
    const isOnMarket: LandMarket = await this.landMarketService.findByLandTokenId(request.landTokenId)
    if (!isOnMarket) {
      throw new ValidateException('This Land is not list on market.')
    }
    const isExists: Array<RentLand> = await this.rentLandRepo.find({where: {isDelete: false, landTokenId: request.landTokenId}})
    if (isExists.length) {
      throw new ValidateException('This Land is already rented.')
    }
    if (request.rentType === 2 && request.period <= 14) {
      throw new ValidateException('Period is invalid.')
    }
    const receipt = await this.contractService.getTransaction(request.hash)
    if ((receipt[0] as ethers.providers.TransactionReceipt).status) {
      const land: Land = await this.landService.findLandEntityByTokenId(request.landTokenId)
      const saveData: RentLand = await this.mapAddRentLandRequestToRentLandEntity(request, userTokenId)
      const result: RentLand = await this.rentLandRepo.save(saveData)
      const deleteData: RemoveLandOnMarketRequest = {landTokenId: land.landTokenId, ownerTokenId: land.landOwnerTokenId}
      await this.landMarketService.removeFromMarket(deleteData)
      await this.landService.updateLandStatus(request.landTokenId, 5)
      const notificationRequest: NotificationsRequestModel = this.mapAddRentLandRequestModelToNotificationRequest(request, userTokenId, land.landOwnerTokenId)
      await this.notificationService.addNotification(notificationRequest)
      const transactionRequestModel: TransactionsRequestModel = this.mapReceiptToTransactionRequestModel((receipt[0] as ethers.providers.TransactionReceipt), (receipt[1] as number), land.landOwnerTokenId, 5)
      const transactionResult: LogTransactions = await this.logTransactionService.addTransactionReturnEntity(transactionRequestModel)
      const paymentData: AddRentPaymentRequestModel = {rentId: result.rentId, logTransactionId: transactionResult.logTransactionsId, price: result.price, renterTokenId: userTokenId}
      await this.rentPaymentService.addPaymentFromRentLand(paymentData, result, transactionResult)
      return result
    }
    throw new ValidateException('Transaction Failed.')
  }

  private async mapRentLandToOwnedRentLandResponse(rentLands: Array<RentLand>): Promise<Array<OwnedRentLandResponseModel>> {
    const results: Array<OwnedRentLandResponseModel> = []
    for await (const item of rentLands) {
      const data: OwnedRentLandResponseModel = {
        ...item,
        landTokenId: await this.mapLandToLandResponseModel(item.landTokenId)
      }
      results.push(data)
    }
    return results
  }

  private async mapRentLandToRentLandDetailsResponse(rentLand: RentLand): Promise<RentLandDetailsResponseModel> {
    const result: RentLandDetailsResponseModel = {
      ...rentLand,
      landTokenId: await this.mapLandToLandResponseModel(rentLand.landTokenId),
      nextPayment: this.calculateNextPayment(rentLand.startDate, rentLand.endDate, rentLand.period), 
      paymentHistories: await this.rentPaymentService.findPaymentByLandAndOwnerTokenId(rentLand.rentId, rentLand.renterTokenId.userTokenId)
    }
    console.log(result.landTokenId)
    return result
  }

  private checkIsLastPayment(endDate: Date): boolean {
    const currentDate: Date = new Date()
    if (currentDate <= endDate) {
      return false
    }
    return true
  }

  private calculateNextPayment(startDate: Date, endDate: Date, period: number): Date {
    if (!this.checkIsLastPayment(endDate)) {
      const start: Date = new Date(startDate)
      let currentDate: Date = new Date()
      if (period > 14) {
        start.setMonth(currentDate.getMonth() + 1)
        return start
      }
    }
    return null
  }

  private mapAddRentLandRequestModelToNotificationRequest(request: AddRentLandRequestModel, userTokenId: string, landOwnerTokenId: string): NotificationsRequestModel {
    const notificationRequest: NotificationsRequestModel = {
      activityId: 3,
      dateTime: new Date(),
      fromUserTokenId: userTokenId,
      ownerTokenId: landOwnerTokenId,
      landTokenId: request.landTokenId,
      price: request.price
    }
    return notificationRequest
  }

  private mapReceiptToTransactionRequestModel(receipt: ethers.providers.TransactionReceipt, time: number, ownerTokenId: string, type: number): TransactionsRequestModel {
    const result: TransactionsRequestModel = {
      fromUserTokenId: receipt.from,
      toUserTokenId: ownerTokenId,
      logType: type,
      transactionBlock: receipt.transactionHash,
      gasPrice: Number(ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice))),
      elapsedTime: time
    }
    return result
  }

  private async mapAddRentLandRequestToRentLandEntity(request: AddRentLandRequestModel, renterTokenId: string): Promise<RentLand> {
    const currentDate: Date = new Date()
    const result: RentLand = {
      rentId: null,
      landTokenId: await this.landService.findLandEntityByTokenId(request.landTokenId),
      rentType: await this.rentTypeService.findByTypeId(request.rentType),
      periodType: await this.periodTypeService.findByPeriodTypeId(request.periodType),
      period: request.period,
      price: request.price,
      fees: this.calculateFees(request.price),
      createAt: currentDate,
      updatedAt: currentDate,
      startDate: currentDate,
      endDate: this.calculateEndDate(currentDate, request.period),
      lastPayment: currentDate,
      isDelete: false,
      renterTokenId: await this.userService.findUserByTokenId(renterTokenId)
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

  private calculateFees(price: number): number {
    return price * (2.5 / 100)
  }

  private async mapLandsToLandResponseModel(lands: Array<Land>): Promise<Array<LandResponseModel>> {
    let result: Array<LandResponseModel> = []
    for await (const land of lands) {
      let data: LandResponseModel = await this.mapLandToLandResponseModel(land)
      result.push(data)
    }
    return result
  }

  private async mapLandToLandResponseModel(land: Land): Promise<LandResponseModel> {
    const landOnMarket: LandMarket = await this.landMarketService.findByLandTokenId(land.landTokenId)
    let location: CoordinatesModel = {
      x: land.landLocation.split(',').map(item => Number(item))[0],
      y: land.landLocation.split(',').map(item => Number(item))[1]
    }
    let position: CoordinatesModel = {
      x: land.landPosition.split(',').map(item => Number(item))[0],
      y: land.landPosition.split(',').map(item => Number(item))[1]
    }
    let result: LandResponseModel = {
      landTokenId: land.landTokenId,
      landName: land.landName,
      landDescription: land.landDescription,
      landOwnerTokenId: land.landOwnerTokenId,
      landLocationList: land.landLocationList,
      landLocation: location,
      landPosition: position,
      landStatus: land.landStatus,
      landAssets: land.landAssets,
      landSize: land.landSize,
      onRecommend: land.onRecommend,
      landUrl: land.landUrl,
      price: landOnMarket ? landOnMarket.price : null,
      minimumOfferPrice: land.minimumOfferPrice,
      bestOffer: await this.offerLandService.findBestOffer(land.landTokenId)
    }
    return result
  }
}
