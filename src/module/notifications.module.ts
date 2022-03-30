import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from 'src/entities/notifications.entity';
import { NotificationsService } from 'src/service/notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notifications])
  ],
  controllers: [],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
