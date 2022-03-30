import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogDescription } from 'src/entities/log-description.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogDescriptionService {

  constructor(
    @InjectRepository(LogDescription) private logDescriptionRepo: Repository<LogDescription>
  ) {}

  public async findAll(): Promise<Array<LogDescription>> {
    let result: Array<LogDescription> = await this.logDescriptionRepo.find()
    return result
  }

}
