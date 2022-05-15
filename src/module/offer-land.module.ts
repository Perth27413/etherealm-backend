import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OfferLandController from 'src/controller/offer-land.controller';
import { OfferLand } from 'src/entities/offer-land.entity';
import { ContractService } from 'src/service/contract.service';
import { LandService } from 'src/service/land.service';
import { OfferLandService } from 'src/service/offer-land.service';
import { LandModule } from './land.module';
import { LogTransactionsModule } from './log-transactions.module';
import { NotificationsModule } from './notifications.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfferLand]),
    UserModule,
    LandModule,
    NotificationsModule,
    LogTransactionsModule
  ],
  controllers: [OfferLandController],
  providers: [OfferLandService, ContractService],
  exports: [OfferLandService]
})
export class OfferLandModule {}
