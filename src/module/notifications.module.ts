import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import NotificationController from 'src/controller/notification.controller';
import { Notifications } from 'src/entities/notifications.entity';
import { LandService } from 'src/service/land.service';
import { NotificationActivityService } from 'src/service/notification-activity.service';
import { NotificationsService } from 'src/service/notifications.service';
import { UserService } from 'src/service/user.service';
import { LandModule } from './land.module';
import { NotificationActivityModule } from './notification-activity.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notifications]),
    LandModule,
    UserModule,
    NotificationActivityModule
  ],
  controllers: [NotificationController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
