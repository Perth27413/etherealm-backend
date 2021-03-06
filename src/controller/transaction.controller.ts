import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import TransactionsRequestModel from 'src/model/transactions/TransactionsRequestModel';
import TransactionsResponseModel from 'src/model/transactions/TransactionsResponseModel';
import { LogTransactions } from 'src/entities/log-transactions.entity';
import { LogTransactionsService } from 'src/service/log-transactions.service';

@Controller('api/transaction')
export default class TransactionController {
  constructor(private readonly transactionService: LogTransactionsService) {}

  @Get()
  public async getAllTransactions(): Promise<Array<LogTransactions>> {
    let transaction: Array<LogTransactions> = await this.transactionService.findAllEntity()
    return transaction
  }

  @Get('/:tokenId')
  public async findByTokenId(@Param("tokenId") tokenId: string): Promise<Array<TransactionsResponseModel>> {
    let transaction: Array<TransactionsResponseModel> = await this.transactionService.getTransactionByUserId(tokenId)
    return transaction
  }

  @Post('/add')
  public async insertTransaction(@Body() transactionRequest: TransactionsRequestModel): Promise<TransactionsResponseModel> {
    let transaction: TransactionsResponseModel = await this.transactionService.addTransaction(transactionRequest)
    return transaction
  }
  
}