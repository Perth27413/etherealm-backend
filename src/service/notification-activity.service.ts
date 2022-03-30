import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationActivity } from 'src/entities/notification-activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationActivityService {

  constructor(
    @InjectRepository(NotificationActivity) private notificationActivityRepo: Repository<NotificationActivity>
  ) {}

  public async findAll(): Promise<Array<NotificationActivity>> {
    let result: Array<NotificationActivity> = await this.notificationActivityRepo.find()
    return result
  }

}
