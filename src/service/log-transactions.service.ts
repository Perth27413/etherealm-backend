import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogTransactions } from 'src/entities/log-transactions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogTransactionsService {

  constructor(
    @InjectRepository(LogTransactions) private logDescriptionRepo: Repository<LogTransactions>
  ) {}

  public async findAll(): Promise<Array<LogTransactions>> {
    let result: Array<LogTransactions> = await this.logDescriptionRepo.find()
    return result
  }

}
