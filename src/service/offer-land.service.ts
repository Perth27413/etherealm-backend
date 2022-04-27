import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferLand } from 'src/entities/offer-land.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OfferLandService {

  constructor(
    @InjectRepository(OfferLand) private offerLandRepo: Repository<OfferLand>
  ) {}

  public async findAll(): Promise<Array<OfferLand>> {
    let result: Array<OfferLand> = await this.offerLandRepo.find()
    return result
  }

}
