import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationActivity } from 'src/entities/notification-activity.entity';
import { NotificationActivityService } from 'src/service/notification-activity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationActivity])
  ],
  controllers: [],
  providers: [NotificationActivityService],
  exports: [NotificationActivityService]
})
export class NotificationActivityModule {}
