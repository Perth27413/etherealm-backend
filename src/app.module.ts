import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LandModule } from './module/land.module';
import { LandStatusModule } from './module/land-status.module';
import { LandSizeModule } from './module/land-size.module';
import { UserModule } from './module/user.module';
import { MarketTypeModule } from './module/market-type.module';
import { LogDescriptionModule } from './module/log-description.module';
import { NotificationActivityModule } from './module/notification-activity.module';
import { LandMarketModule } from './module/land-market.module';
import { NotificationsModule } from './module/notifications.module';
import { LogTransactionsModule } from './module/log-transactions.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345678',
      database: 'postgres',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      retryDelay: 3000,
      retryAttempts: 10
    }),
    LandModule,
    LandStatusModule,
    LandSizeModule,
    UserModule,
    MarketTypeModule,
    LogDescriptionModule,
    NotificationActivityModule,
    LandMarketModule,
    NotificationsModule,
    LogTransactionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
