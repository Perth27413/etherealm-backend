import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogTransactions } from 'src/entities/log-transactions.entity';
import { Repository } from 'typeorm';
import TransactionsResponseModel from 'src/model/transactions/TransactionsResponseModel';
import TransactionsRequestModel from 'src/model/transactions/TransactionsRequestModel';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import DataNotFoundException from 'src/Exception/DataNotFoundException';
import { LogTypeService } from './log-type.service';
import { LogType } from 'src/entities/log-type.entity';

@Injectable()
export class LogTransactionsService {

  constructor(
    @InjectRepository(LogTransactions) private logDescriptionRepo: Repository<LogTransactions>,
    private userService: UserService,
    private logDescriptionService: LogTypeService
  ) {}

  public async findAll(): Promise<Array<TransactionsResponseModel>> {
    let data: Array<LogTransactions> = await this.logDescriptionRepo.find()
    let result: Array<TransactionsResponseModel> = this.mapTransactionsToResponse(data)
    return result
  }

  public async getTransactionByUserId(userTokenId: string): Promise<Array<TransactionsResponseModel>> {
    let user: User = await this.userService.findUserByTokenId(userTokenId)
    if (!user) {
      throw new DataNotFoundException
    }
    let data: Array<LogTransactions> = await this.logDescriptionRepo.find({where: {fromUserTokenId: userTokenId}, relations:['fromUserTokenId', 'toUserTokenId', 'logType']})
    let results: Array<TransactionsResponseModel> = this.mapTransactionsToResponse(data)
    return results
  }

  public async addTransaction(transactionsRequest: TransactionsRequestModel): Promise<TransactionsResponseModel> {
    let data: LogTransactions = await this.mapTransactionRequestToEntity(transactionsRequest)
    let transaction: LogTransactions = await this.logDescriptionRepo.save(data)
    let result: TransactionsResponseModel = await this.mapTransactionToResponse(transaction)
    return result
  }

  public async addTransactionReturnEntity(transactionsRequest: TransactionsRequestModel): Promise<LogTransactions> {
    let data: LogTransactions = await this.mapTransactionRequestToEntity(transactionsRequest)
    let transaction: LogTransactions = await this.logDescriptionRepo.save(data)
    return transaction
  }

  private mapTransactionsToResponse(transactions: Array<LogTransactions>): Array<TransactionsResponseModel> {
    let results: Array<TransactionsResponseModel> = []
    transactions.forEach((transaction: LogTransactions) => {
      let data: TransactionsResponseModel = this.mapTransactionToResponse(transaction)
      results.push(data)
    })
    return results
  }

  private mapTransactionToResponse(transactions: LogTransactions): TransactionsResponseModel {
    let result: TransactionsResponseModel = {
      logTransactionsId: transactions.logTransactionsId,
      fromUserTokenId: transactions.fromUserTokenId.userTokenId,
      toUserTokenId: transactions.toUserTokenId.userTokenId,
      transactionBlock: transactions.transactionBlock,
      gasPrice: transactions.gasPrice,
      logType: transactions.logType,
      createdAt: transactions.createdAt.toLocaleString().replace(',', '')
    }
    return result
  }

  private async mapTransactionRequestToEntity(transactionsRequest: TransactionsRequestModel): Promise<LogTransactions> {
    let fromUser: User = await this.userService.findUserByTokenId(transactionsRequest.fromUserTokenId)
    let toUser: User = await this.userService.findUserByTokenId(transactionsRequest.toUserTokenId)
    let description: LogType = await this.logDescriptionService.findById(transactionsRequest.logType)
    let result: LogTransactions = {
      logTransactionsId: null,
      fromUserTokenId: fromUser,
      toUserTokenId: toUser,
      transactionBlock: transactionsRequest.transactionBlock,
      gasPrice: transactionsRequest.gasPrice,
      logType: description,
      createdAt: new Date(),
      elapsedTime: transactionsRequest.elapsedTime
    }
    return result
  }

}
