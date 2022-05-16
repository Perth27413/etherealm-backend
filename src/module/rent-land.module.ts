import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandModule } from './land.module';
import { RentLandService } from 'src/service/rent-land.service';
import { RentLand } from 'src/entities/rent-land.entity';
import { RentTypeModule } from './rent-type.module';
import { PeriodTypeModule } from './period-type.module';
import { ContractService } from 'src/service/contract.service';
import { LogTransactionsModule } from './log-transactions.module';
import { NotificationsModule } from './notifications.module';
import { RentPaymentModule } from './rent-payment.module';
import { UserModule } from './user.module';
import RentLandController from 'src/controller/rent-land.controller';
import { LandMarketModule } from './land-market.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RentLand]),
    LandModule,
    RentTypeModule,
    PeriodTypeModule,
    LogTransactionsModule,
    NotificationsModule,
    RentPaymentModule,
    UserModule,
    LandMarketModule
  ],
  controllers: [RentLandController],
  providers: [RentLandService, ContractService],
  exports: [RentLandService]
})
export class RentLandModule {}
