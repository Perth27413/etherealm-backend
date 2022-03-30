import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from 'src/entities/notifications.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {

  constructor(
    @InjectRepository(Notifications) private logDescriptionRepo: Repository<Notifications>
  ) {}

  public async findAll(): Promise<Array<Notifications>> {
    let result: Array<Notifications> = await this.logDescriptionRepo.find()
    return result
  }

}
