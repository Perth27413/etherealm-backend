import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandMarketController } from 'src/controller/land-market.controller';
import { LandMarket } from 'src/entities/land-market.entity';
import { ContractService } from 'src/service/contract.service';
import { LandMarketService } from 'src/service/land-market.service';
import { LandModule } from './land.module';
import { LogTransactionsModule } from './log-transactions.module';
import { MarketTypeModule } from './market-type.module';
import { NotificationsModule } from './notifications.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LandMarket]),
    UserModule,
    MarketTypeModule,
    NotificationsModule,
    LandModule,
    LogTransactionsModule
  ],
  controllers: [LandMarketController],
  providers: [LandMarketService, ContractService],
  exports: [LandMarketService]
})
export class LandMarketModule {}
