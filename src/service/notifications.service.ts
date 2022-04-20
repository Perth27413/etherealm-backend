import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from 'src/entities/notifications.entity';
import NotificationsRequestModel from 'src/model/notifications/NotificationsRequestModel';
import NotificationsResponseModel from 'src/model/notifications/NotificationsResponseModel';
import { Repository } from 'typeorm';
import { LandService } from './land.service';
import { NotificationActivityService } from './notification-activity.service';
import { UserService } from './user.service';

@Injectable()
export class NotificationsService {

  constructor(
    @InjectRepository(Notifications) private notificationRepo: Repository<Notifications>,
    private notificationActivityService: NotificationActivityService,
    private userService: UserService,
    private landService: LandService
  ) {}

  public async findAll(): Promise<Array<Notifications>> {
    let result: Array<Notifications> = await this.notificationRepo.find({relations: ['activityId', 'ownerUserTokenId', 'fromUserTokenId', 'landTokenId']})
    return result
  }

  public async findNotificationByUserTokenId(userTokenId: string): Promise<Array<NotificationsResponseModel>> {
    let result: Array<Notifications> = await this.notificationRepo.find({where: {ownerUserTokenId: userTokenId}, relations: ['activityId', 'ownerUserTokenId', 'fromUserTokenId', 'landTokenId']})
    return this.mapNotificationEntityToNotificationResponse(result)
  }

  public async addNotification(request: NotificationsRequestModel): Promise<Notifications> {
    const data: Notifications = await this.mapNotificationRequestToNotificationEntity(request)
    const result: Notifications = await this.notificationRepo.save(data)
    return result
  }

  public async mapNotificationRequestToNotificationEntity(request: NotificationsRequestModel): Promise<Notifications> {
    const result: Notifications = {
      ownerUserTokenId: await this.userService.findUserByTokenId(request.ownerTokenId),
      fromUserTokenId: await this.userService.findUserByTokenId(request.fromUserTokenId),
      price: request.price,
      landTokenId: await this.landService.findLandEntityByTokenId(request.landTokenId),
      dateTime: new Date(),
      notificationId: null,
      activityId: await this.notificationActivityService.findActivityById(request.activityId)
    }
    return result
  }

  private mapNotificationEntityToNotificationResponse(notification: Array<Notifications>): Array<NotificationsResponseModel> {
    const result: Array<NotificationsResponseModel> = []
    notification.forEach((item: Notifications) => {
      const data: NotificationsResponseModel = {
        activity: item.activityId.activityName,
        fromUserTokenId: item.fromUserTokenId.userTokenId,
        ownerUserTokenId: item.ownerUserTokenId.userTokenId,
        landName: item.landTokenId.landName,
        dateTime: item.dateTime.toLocaleString().replace(',', '')
      }
      result.push(data)
    })
    return result
  }

}
