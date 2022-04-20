import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import TransactionsRequestModel from 'src/model/transactions/TransactionsRequestModel';
import TransactionsResponseModel from 'src/model/transactions/TransactionsResponseModel';
import { LogTransactions } from 'src/entities/log-transactions.entity';
import { LogTransactionsService } from 'src/service/log-transactions.service';
import { Notifications } from 'src/entities/notifications.entity';
import { NotificationsService } from 'src/service/notifications.service';

@Controller('api/notification')
export default class NotificationController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  public async findAll(): Promise<Array<Notifications>> {
    let notification: Array<Notifications> = await this.notificationService.findAll()
    return notification
  }

  @Get('/:userTokenId')
  public async findNotificationByUserTokenId(@Param("userTokenId") userTokenId: string): Promise<Array<Notifications>> {
    let notification: Array<Notifications> = await this.notificationService.findNotificationByUserTokenId(userTokenId)
    return notification
  }
  
}