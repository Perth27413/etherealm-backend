import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LandSize } from 'src/entities/land-size.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LandSizeService {

  constructor(
    @InjectRepository(LandSize) private landSizeRepo: Repository<LandSize>
  ) {}

  public async findSizeById(sizeId: number): Promise<LandSize> {
    let size: LandSize = await this.landSizeRepo.findOne(sizeId)
    return size
  }

  public async findSizeByValue(landSize: number): Promise<LandSize> {
    let size: LandSize = await this.landSizeRepo.findOne({ landSize })
    return size
  }

}
