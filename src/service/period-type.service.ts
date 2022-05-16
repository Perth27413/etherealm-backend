import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodType } from 'src/entities/period-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PeriodTypeService {

  constructor(
    @InjectRepository(PeriodType) private periodTypeRepo: Repository<PeriodType>
  ) {}

  public async findAll(): Promise<Array<PeriodType>> {
    let result: Array<PeriodType> = await this.periodTypeRepo.find()
    return result
  }

  public async findByPeriodTypeId(periodTypeId: number): Promise<PeriodType> {
    let result: PeriodType = await this.periodTypeRepo.findOne({where: {periodTypeId: periodTypeId}})
    return result
  }

}
