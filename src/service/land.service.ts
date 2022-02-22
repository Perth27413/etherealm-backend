import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LandStatus } from 'src/entities/land-status.entity';
import DataNotFoundException from 'src/Exception/DataNotFoundException';
import { ValidateException } from 'src/Exception/ValidateException';
import LandRequestModel from 'src/model/lands/LandRequestModel';
import { Repository } from 'typeorm';
import { Land } from '../entities/land.entity';
import { LandStatusService } from './land-status.service';

@Injectable()
export class LandService {

  constructor(
    @InjectRepository(Land) private landRepo: Repository<Land>,
    private landStatusService: LandStatusService
  ) {}

  public async findAll(): Promise<Array<Land>> {
    let allLands: Array<Land> = await this.landRepo.find({relations: ["landStatus"]})
    return allLands
  }

  public async findLandByTokenId(tokenId: string): Promise<Land> {
    let land: Land = await this.landRepo.findOne(tokenId, {relations: ["landStatus"]})
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

  private async checkLandIsExists(landTokenId: string): Promise<Land | null> {
    let land: Land = await this.landRepo.findOne(landTokenId, {relations: ["landStatus"]})
    if (land) {
      return land
    }
    return null
  }

  private async mapLandRequestModelToLandEntity(landRequest: LandRequestModel): Promise<Land> {
    let status: LandStatus = await this.landStatusService.findStatusById(landRequest.landStatus)
    let result: Land = {
      landTokenId: landRequest.landTokenId,
      landName: landRequest.landName,
      landDescription: landRequest.landDescription,
      landOwnerTokenId: landRequest.landOwnerTokenId,
      landLocation: landRequest.landLocation,
      landStatus: status,
      landAssets: landRequest.landAssets,
      onRecommend: landRequest.onRecommend
    }
    return result
  }

}
