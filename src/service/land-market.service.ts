import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { LandMarket } from 'src/entities/land-market.entity';
import { Land } from 'src/entities/land.entity';
import { MarketType } from 'src/entities/market-type.entity';
import { Notifications } from 'src/entities/notifications.entity';
import { User } from 'src/entities/user.entity';
import DataNotFoundException from 'src/Exception/DataNotFoundException';
import { ValidateException } from 'src/Exception/ValidateException';
import LandResponseModel from 'src/model/lands/LandResponseModel';
import BuyLandOnMarketRequestModel from 'src/model/market/BuyLandOnMarketRequestModel';
import LandMarketRequestModel from 'src/model/market/LandMarketRequestModel';
import RemoveLandOnMarketRequest from 'src/model/market/RemoveLandOnMarketRequest';
import UpdateLandPriceOnMarketRequestModel from 'src/model/market/UpdateLandPriceOnMarketRequestModel';
import NotificationsRequestModel from 'src/model/notifications/NotificationsRequestModel';
import TransactionsRequestModel from 'src/model/transactions/TransactionsRequestModel';
import TransactionsResponseModel from 'src/model/transactions/TransactionsResponseModel';
import { Repository } from 'typeorm';
import { ContractService } from './contract.service';
import { LandService } from './land.service';
import { LogTransactionsService } from './log-transactions.service';
import { MarketTypeService } from './market-type.service';
import { NotificationsService } from './notifications.service';
import { OfferLandService } from './offer-land.service';
import { UserService } from './user.service';

@Injectable()
export class LandMarketService {

  constructor(
    @InjectRepository(LandMarket) private landMarketRepo: Repository<LandMarket>,
    private landService: LandService,
    private userService: UserService,
    private marketTypeService: MarketTypeService,
    private contractService: ContractService,
    private notificationService: NotificationsService,
    private logTransactionService: LogTransactionsService,
    private offerlandService: OfferLandService
  ) {}

  public async findAll(): Promise<Array<LandMarket>> {
    let result: Array<LandMarket> = await this.landMarketRepo.find({where: {isDelete: false}, relations: ['landTokenId', 'ownerUserTokenId', 'marketType']})
    return result
  }

  public async findByLandTokenId(landTokenId: string): Promise<LandMarket> {
    let result: LandMarket = await this.landMarketRepo.findOne({where: {landTokenId: landTokenId, isDelete: false}, relations: ['landTokenId', 'ownerUserTokenId', 'marketType']})
    return result
  }

  public async addLandToLandMarket(request: LandMarketRequestModel): Promise<LandMarket> {
    const exists: LandMarket = await this.landMarketRepo.findOne({where: {landTokenId: request.landTokenId, isDelete: false}})
    if (exists) {
      throw new ValidateException('Land is already listed on market.')
    }
    const land: Land = await this.landService.findLandEntityByTokenId(request.landTokenId)
    if (land.landOwnerTokenId !== request.ownerUserTokenId) {
      throw new ValidateException('Land owner is invalid.')
    }
    const statusId: number = request.marketType === 1 ? 3 : 4
    await this.landService.updateLandStatus(request.landTokenId, statusId)
    const data: LandMarket = await this.mapLandMarketRequestModelToLandMarket(request)
    let result: LandMarket = await this.landMarketRepo.save(data)
    await this.offerlandService.clearOfferWhenAddLanddOnMarket(request.landTokenId)
    return result
  }

  public async updateLandPriceOnMarket(request: UpdateLandPriceOnMarketRequestModel): Promise<LandMarket> {
    const exists: LandMarket = await this.landMarketRepo.findOne({where: {landTokenId: request.landTokenId, ownerUserTokenId: request.ownerTokenId, isDelete: false}, relations: ['landTokenId', 'ownerUserTokenId', 'marketType']})
    if (exists) {
      exists.price = request.price
      const result: LandMarket = await this.landMarketRepo.save(exists)
      return result
    }
    throw new DataNotFoundException
  }

  public async removeFromMarket(request: RemoveLandOnMarketRequest): Promise<string> {
    const exists: LandMarket = await this.landMarketRepo.findOne({where: {landTokenId: request.landTokenId, ownerUserTokenId: request.ownerTokenId, isDelete: false}})
    if (exists) {
      await this.landService.updateLandStatus(request.landTokenId, 2)
      exists.isDelete = true
      await this.landMarketRepo.save(exists)
      return 'Cancel listing on market Success'
    }
    throw new DataNotFoundException
  }

  public async buyLandOnMarket(request: BuyLandOnMarketRequestModel): Promise<LandResponseModel> {
    const landOnMarket: LandMarket = await this.landMarketRepo.findOne({where: {landTokenId: request.landTokenId, isDelete: false}, relations: ['landTokenId', 'ownerUserTokenId', 'marketType']})
    if (!landOnMarket) {
      throw new ValidateException('This Land is not list on market.')
    }
    if (landOnMarket.ownerUserTokenId.userTokenId === request.fromUserTokenId) {
      const receipt = await this.contractService.getTransaction(request.hash)
      if (receipt.status) {
        const land: LandResponseModel = await this.landService.transferLand(request.fromUserTokenId, request.toUserTokenId, request.landTokenId)
        const notificationRequest: NotificationsRequestModel = this.mapBuyLandRequestToNotificationRequest(request, landOnMarket.price)
        const notification: Notifications = await this.notificationService.addNotification(notificationRequest)
        const transactionRequestModel: TransactionsRequestModel = this.mapReceiptToTransactionRequestModel(receipt, landOnMarket.ownerUserTokenId.userTokenId, 1)
        const transaction: TransactionsResponseModel = await this.logTransactionService.addTransaction(transactionRequestModel)
        await this.landMarketRepo.delete(landOnMarket)
        return land
      } else {
        throw new ValidateException('Transaction failed.')
      }
    }
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

  private mapBuyLandRequestToNotificationRequest(request: BuyLandOnMarketRequestModel, price: number): NotificationsRequestModel {
    const notificationRequest: NotificationsRequestModel = {
      activityId: 2,
      dateTime: new Date(),
      fromUserTokenId: request.toUserTokenId,
      ownerTokenId: request.fromUserTokenId,
      landTokenId: request.landTokenId,
      price: price
    }
    return notificationRequest
  }

  private async mapLandMarketRequestModelToLandMarket(request: LandMarketRequestModel): Promise<LandMarket> {
    const land: Land = await this.landService.findLandEntityByTokenId(request.landTokenId)
    const owner: User = await this.userService.findUserByTokenId(request.ownerUserTokenId)
    const marketType: MarketType = await this.marketTypeService.findTypeById(request.marketType)
    const currentTime: Date = new Date()
    let result: LandMarket = {
      landTokenId: land,
      ownerUserTokenId: owner,
      period: request.period,
      price: request.price,
      marketType: marketType,
      landMarketId: null,
      fees: this.calculateFees(request.price),
      createdAt: currentTime,
      updatedAt: currentTime,
      isDelete: false
    }
    return result
  }

  private calculateFees(price: number): number {
    return price * (2.5 / 100)
  }

}
