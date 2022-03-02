import { Injectable } from '@nestjs/common';
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

@Injectable()
export class LandService {

  constructor(
    @InjectRepository(Land) private landRepo: Repository<Land>,
    private landStatusService: LandStatusService,
    private landSizeService: LandSizeService
  ) {}

  public async findAll(): Promise<Array<LandResponseModel>> {
    let allLands: Array<Land> = await this.landRepo.find({relations: ["landStatus", "landSize"]})
    let results: Array<LandResponseModel> = this.mapLandsToLandResponseModel(allLands)
    return results
  }

  public async findLandByTokenId(tokenId: string): Promise<LandResponseModel> {
    let land: Land = await this.landRepo.findOne(tokenId, {relations: ["landStatus", "landSize"]})
    if (!land) {
      throw new DataNotFoundException
    }
    let result: LandResponseModel = this.mapLandToLandResponseModel(land)
    return result
  }

  public async findLandByOwnerTokenId(ownerTokenId: string): Promise<Array<LandResponseModel>> {
    let land: Array<Land> = await this.landRepo.find({where: {landOwnerTokenId: ownerTokenId}, relations: ["landStatus", "landSize"]})
    if (!land.length) {
      return []
    }
    let result: Array<LandResponseModel> = this.mapLandsToLandResponseModel(land)
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
    let land: Land = await this.mapLandRequestModelToLandEntity(landRequest)
    land = await this.landRepo.save(land)
    let result: LandResponseModel = this.mapLandToLandResponseModel(land)
    return result
  }

  public async purchaseLand(purchaseLandRequest: PurchaseLandRequestModel): Promise<LandResponseModel> {
    try {
      let land: Land = await this.landRepo.findOne({where: {landTokenId: purchaseLandRequest.landTokenId}, relations: ["landStatus", "landSize"]})
      land.landOwnerTokenId = purchaseLandRequest.ownerTokenId
      land.landStatus = await this.landStatusService.findStatusById(2)
      land = await this.landRepo.save(land)
      let result: LandResponseModel = this.mapLandToLandResponseModel(land)
      return result
    } catch (error) {
      console.error(error)
      throw new ValidateException('Error when purchase land')
    }
  }

  public async generateLands(): Promise<string> {
    try {
      let allLands: Array<Land> = await this.landRepo.find({relations: ["landStatus", "landSize"]})
      if (!allLands.length) {
        for (let index = 0; index < lands.length; index++) {
          let data: Land = {
            landTokenId: lands[index].tokenId,
            landName: `Land(${lands[index].location.x}, ${lands[index].location.y})`,
            landDescription: 'No Description',
            landOwnerTokenId: '',
            landLocation: `${lands[index].location.x},${lands[index].location.y}`,
            landPosition: `${lands[index].start.x},${lands[index].start.y}`,
            landStatus: await this.landStatusService.findStatusById(3), // status 3 = No Owner
            landAssets: '',
            landSize: await this.landSizeService.findSizeByValue(lands[index].end.x - lands[index].start.x),
            onRecommend: false
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

  private mapLandsToLandResponseModel(lands: Array<Land>): Array<LandResponseModel> {
    let result: Array<LandResponseModel> = []
    lands.forEach((land: Land) => {
      let data: LandResponseModel = this.mapLandToLandResponseModel(land)
      result.push(data)
    })
    return result
  }

  private mapLandToLandResponseModel(land: Land): LandResponseModel {
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
      onRecommend: land.onRecommend
    }
    return result
  }

  private async mapLandRequestModelToLandEntity(landRequest: LandRequestModel): Promise<Land> {
    let status: LandStatus = await this.landStatusService.findStatusById(landRequest.landStatus)
    let size: LandSize = await this.landSizeService.findSizeById(landRequest.landSize)
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
      onRecommend: landRequest.onRecommend
    }
    return result
  }

}
