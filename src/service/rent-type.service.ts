import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentType } from 'src/entities/rent-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RentTypeService {

  constructor(
    @InjectRepository(RentType) private rentTypeRepo: Repository<RentType>
  ) {}

  public async findAll(): Promise<Array<RentType>> {
    let result: Array<RentType> = await this.rentTypeRepo.find()
    return result
  }

  public async findByTypeId(id: number): Promise<RentType> {
    const result: RentType = await this.rentTypeRepo.findOne({where: {rentTypeId: id}})
    return result
  }

}
