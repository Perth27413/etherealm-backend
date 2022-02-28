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

@Injectable()
export class LandService {

  constructor(
    @InjectRepository(Land) private landRepo: Repository<Land>,
    private landStatusService: LandStatusService,
    private landSizeService: LandSizeService
  ) {}

  public async findAll(): Promise<Array<Land>> {
    let allLands: Array<Land> = await this.landRepo.find({relations: ["landStatus", "landSize"]})
    return allLands
  }

  public async findLandByTokenId(tokenId: string): Promise<Land> {
    let land: Land = await this.landRepo.findOne(tokenId, {relations: ["landStatus", "landSize"]})
    if (!land) {
      throw new DataNotFoundException
    }
    return land
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

  public async generateLands(): Promise<string> {
    try {
      let allLands: Array<Land> = await this.landRepo.find({relations: ["landStatus"]})
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
          let landResult: Land = await this.landRepo.save(data)
          break
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
