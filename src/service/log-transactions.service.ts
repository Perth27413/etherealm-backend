import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogTransactions } from 'src/entities/log-transactions.entity';
import { Repository } from 'typeorm';
import TransactionsResponseModel from 'src/model/transactions/TransactionsResponseModel';
import TransactionsRequestModel from 'src/model/transactions/TransactionsRequestModel';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import DataNotFoundException from 'src/Exception/DataNotFoundException';
import { LogDescriptionService } from './log-description.service';
import { LogDescription } from 'src/entities/log-description.entity';

@Injectable()
export class LogTransactionsService {

  constructor(
    @InjectRepository(LogTransactions) private logDescriptionRepo: Repository<LogTransactions>,
    private userService: UserService,
    private logDescriptionService: LogDescriptionService
  ) {}

  public async findAll(): Promise<Array<TransactionsResponseModel>> {
    let data: Array<LogTransactions> = await this.logDescriptionRepo.find()
    let result: Array<TransactionsResponseModel> = this.mapTransactionsToResponse(data)
    return result
  }

  public async getTransactionByUserId(userTokenId): Promise<Array<TransactionsResponseModel>> {
    let user: User = await this.userService.findUserByTokenId(userTokenId)
    if (!user) {
      throw new DataNotFoundException
    }
    let data: Array<LogTransactions> = await this.logDescriptionRepo.find({where: {fromUserTokenId: userTokenId}, relations:['fromUserTokenId', 'toUserTokenId', 'logDescription']})
    let results: Array<TransactionsResponseModel> = this.mapTransactionsToResponse(data)
    return results
  }

  public async addTransaction(transactionsRequest: TransactionsRequestModel): Promise<TransactionsResponseModel> {
    let data: LogTransactions = await this.mapTransactionRequestToEntity(transactionsRequest)
    let transaction: LogTransactions = await this.logDescriptionRepo.save(data)
    let result: TransactionsResponseModel = await this.mapTransactionToResponse(transaction)
    return result
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
      logDescription: transactions.logDescription
    }
    return result
  }

  private async mapTransactionRequestToEntity(transactionsRequest: TransactionsRequestModel): Promise<LogTransactions> {
    let fromUser: User = await this.userService.findUserByTokenId(transactionsRequest.fromUserTokenId)
    let toUser: User = await this.userService.findUserByTokenId(transactionsRequest.toUserTokenId)
    let description: LogDescription = await this.logDescriptionService.findByID(transactionsRequest.logDescription)
    let result: LogTransactions = {
      logTransactionsId: transactionsRequest.logTransactionsId,
      fromUserTokenId: fromUser,
      toUserTokenId: toUser,
      transactionBlock: transactionsRequest.transactionBlock,
      gasPrice: transactionsRequest.gasPrice,
      logDescription: description
    }
    return result
  }

}
