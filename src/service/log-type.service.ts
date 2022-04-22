import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogType } from 'src/entities/log-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogTypeService {

  constructor(
    @InjectRepository(LogType) private logDescriptionRepo: Repository<LogType>
  ) {}

  public async findAll(): Promise<Array<LogType>> {
    let result: Array<LogType> = await this.logDescriptionRepo.find()
    return result
  }

  public async findById(id: number): Promise<LogType> {
    let result: LogType = await this.logDescriptionRepo.findOne({where: {logTypeId: id}})
    return result
  }

}
