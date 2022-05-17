import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LandStatus } from 'src/entities/land-status.entity';
import DataNotFoundException from 'src/Exception/DataNotFoundException';
import { ValidateException } from 'src/Exception/ValidateException';
import LandRequestModel from 'src/model/lands/LandRequestModel';
import { Repository } from 'typeorm';
import { Land } from '../entities/land.entity';
import { LandStatusService } from './land-status.service';
import * as lands from '../json/lands.json'
import { LandSizeService } from './land-size.service';
import { LandSize } from 'src/entities/land-size.entity';
import PurchaseLandRequestModel from 'src/model/lands/PurchaseLandRequestModel';
import LandResponseModel from 'src/model/lands/LandResponseModel';
import CoordinatesModel from 'src/model/lands/CoordinatesModel';
import { LandMarket } from 'src/entities/land-market.entity';
import { ContractService } from './contract.service';
import { OfferLandService } from './offer-land.service';
import { OfferLand } from 'src/entities/offer-land.entity';

@Injectable()
export class LandService {

  constructor(
    @InjectRepository(Land) private landRepo: Repository<Land>,
    @InjectRepository(LandMarket) private landMarketRepo: Repository<LandMarket>,
    @InjectRepository(OfferLand) private offerLandRepo: Repository<OfferLand>,
    private landStatusService: LandStatusService,
    private landSizeService: LandSizeService
  ) {}

  public async findAll(): Promise<Array<LandResponseModel>> {
    let allLands: Array<Land> = await this.landRepo.find({relations: ["landStatus", "landSize"]})
    let results: Array<LandResponseModel> = await this.mapLandsToLandResponseModel(allLands)
    return results
  }

  public async findLandEntityByLandTokenIdAndLandStatus(landTokenId: string, statusId: number): Promise<Land> {
    const result: Land = await this.landRepo.findOne({where: {landTokenId: landTokenId}, relations: ["landStatus", "landSize"]})
    if (!result || result.landStatus.landStatusId !== statusId) {
      throw new DataNotFoundException
    }
    return result
  }

  public async findLandByTokenId(tokenId: string): Promise<LandResponseModel> {
    let land: Land = await this.landRepo.findOne(tokenId, {relations: ["landStatus", "landSize"]})
    if (!land) {
      throw new DataNotFoundException
    }
    let result: LandResponseModel = await this.mapLandToLandResponseModel(land)
    return result
  }

  public async findLandEntityByTokenId(tokenId: string): Promise<Land> {
    let land: Land = await this.landRepo.findOne(tokenId, {relations: ["landStatus", "landSize"]})
    if (!land) {
      throw new DataNotFoundException
    }
    return land
  }

  public async findLandByOwnerTokenId(ownerTokenId: string): Promise<Array<LandResponseModel>> {
    let land: Array<Land> = await this.landRepo.find({where: {landOwnerTokenId: ownerTokenId}, relations: ["landStatus", "landSize"]})
    if (!land.length) {
      return []
    }
    let result: Array<LandResponseModel> = await this.mapLandsToLandResponseModel(land)
    return result
  }

  public async insertLand(landRequest: LandRequestModel): Promise<Land> {
    let data: Land = await this.mapLandRequestModelToLandEntity(landRequest)
    try {
      let existsLand: Land = await this.checkLandIsExists(landRequest.landTokenId)
      if (existsLand) {
        return existsLand
      }
      let landResult: Land = await this.landRepo.save(data)
      return landResult
    } catch (error) {
      console.error(error)
      throw new ValidateException('Body is invalid')
    }
  }

  public async updateLand(landRequest: LandRequestModel): Promise<LandResponseModel> {
    if (landRequest.minimumOfferPrice < 0.00001) {
      throw new ValidateException('Minimum Offer Price is invalid.')
    }
    let land: Land = await this.mapLandRequestModelToLandEntity(landRequest, landRequest.minimumOfferPrice)
    land = await this.landRepo.save(land)
    let result: LandResponseModel = await this.mapLandToLandResponseModel(land)
    return result
  }

  public async purchaseLand(purchaseLandRequest: PurchaseLandRequestModel): Promise<LandResponseModel> {
    try {
      let land: Land = await this.landRepo.findOne({where: {landTokenId: purchaseLandRequest.landTokenId}, relations: ["landStatus", "landSize"]})
      land.landOwnerTokenId = purchaseLandRequest.ownerTokenId
      land.landStatus = await this.landStatusService.findStatusById(2)
      land = await this.landRepo.save(land)
      let result: LandResponseModel = await this.mapLandToLandResponseModel(land)
      return result
    } catch (error) {
      console.error(error)
      throw new ValidateException('Error when purchase land')
    }
  }

  public async updateLandStatus(landTokenId: string, statusId: number): Promise<void> {
    const status: LandStatus = await this.landStatusService.findStatusById(statusId)
    let land: Land = await this.landRepo.findOne({where: {landTokenId: landTokenId}, relations: ["landStatus", "landSize"]})
    land.landStatus = status
    await this.landRepo.save(land)
  }

  public async transferLand(from: string, to: string, landTokenId: string): Promise<LandResponseModel> {
    const exists: Land = await this.landRepo.findOne({where:{landTokenId: landTokenId, landOwnerTokenId: from}, relations: ["landStatus", "landSize"]})
    if (exists) {
      const status: LandStatus = await this.landStatusService.findStatusById(2)
      exists.landOwnerTokenId = to
      exists.landStatus = status      
      const land: Land = await this.landRepo.save(exists)
      const result: LandResponseModel = await this.mapLandToLandResponseModel(land)
      return result
    } else {
      throw new ValidateException('Land owner is invalid.')
    }
  }

  public async generateLands(): Promise<string> {
    try {
      let allLands: Array<Land> = await this.landRepo.find({relations: ["landStatus", "landSize"]})
      if (!allLands.length) {
        for (let index = 0; index < lands.length; index++) {
          const currentTime: Date = new Date()
          let data: Land = {
            landTokenId: lands[index].tokenId,
            landName: `Land(${lands[index].location.x}, ${lands[index].location.y})`,
            landDescription: 'No Description',
            landOwnerTokenId: '',
            landLocation: `${lands[index].location.x},${lands[index].location.y}`,
            landPosition: `${lands[index].start.x},${lands[index].start.y}`,
            landStatus: await this.landStatusService.findStatusById(1), // status 1 = No Owner
            landAssets: '',
            landSize: await this.landSizeService.findSizeByValue(lands[index].end.x - lands[index].start.x),
            onRecommend: false,
            minimumOfferPrice: 0.00001,
            createdAt: currentTime,
            updatedAt: currentTime
          }
          await this.landRepo.save(data)
        }
        return 'Generate Lands Success'
      }
    } catch (error) {
      console.error(error)
      throw new ValidateException('Error when generate lands')
    }
  }

  private async checkLandIsExists(landTokenId: string): Promise<Land | null> {
    let land: Land = await this.landRepo.findOne(landTokenId, {relations: ["landStatus"]})
    if (land) {
      return land
    }
    return null
  }

  public async mapLandsToLandResponseModel(lands: Array<Land>): Promise<Array<LandResponseModel>> {
    let result: Array<LandResponseModel> = []
    for await (const land of lands) {
      let data: LandResponseModel = await this.mapLandToLandResponseModel(land)
      result.push(data)
    }
    return result
  }

  public async mapLandToLandResponseModel(land: Land): Promise<LandResponseModel> {
    const landOnMarket: LandMarket = await this.landMarketRepo.findOne({where: {landTokenId: land.landTokenId}, relations: ['landTokenId', 'ownerUserTokenId', 'marketType']})
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
      landLocation: location,
      landPosition: position,
      landStatus: land.landStatus,
      landAssets: land.landAssets,
      landSize: land.landSize,
      onRecommend: land.onRecommend,
      price: landOnMarket ? landOnMarket.price : null,
      minimumOfferPrice: land.minimumOfferPrice,
      bestOffer: await this.offerLandRepo.findOne({where: {landTokenId: land.landTokenId, isDelete: false}, order: {offerPrice: 'DESC', createAt: 'ASC'}, relations: ['fromUserTokenId']})
    }
    return result
  }

  private async mapLandRequestModelToLandEntity(landRequest: LandRequestModel, minimumOfferPrice?: number): Promise<Land> {
    let status: LandStatus = await this.landStatusService.findStatusById(landRequest.landStatus)
    let size: LandSize = await this.landSizeService.findSizeById(landRequest.landSize)
    const currentLand: Date = new Date()
    let result: Land = {
      landTokenId: landRequest.landTokenId,
      landName: landRequest.landName,
      landDescription: landRequest.landDescription,
      landOwnerTokenId: landRequest.landOwnerTokenId,
      landLocation: landRequest.landLocation,
      landPosition: landRequest.landPosition,
      landStatus: status,
      landAssets: landRequest.landAssets,
      landSize: size,
      onRecommend: landRequest.onRecommend,
      minimumOfferPrice: minimumOfferPrice ? minimumOfferPrice : 0.00001,
      createdAt: currentLand,
      updatedAt: currentLand
    }
    return result
  }

}
