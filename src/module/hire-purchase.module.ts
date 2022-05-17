import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandModule } from './land.module';
import { HirePurchase } from 'src/entities/hire-purchase.entity';
import { HirePurchaseService } from 'src/service/hire-purchase.service';
import { ContractService } from 'src/service/contract.service';
import { UserModule } from './user.module';
import { LogTransactionsModule } from './log-transactions.module';
import { HirePurchasePaymentModule } from './hire-purchase-payment.module';
import HirePurchaseLandController from 'src/controller/hire-purchase-land.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([HirePurchase]),
    LandModule,
    UserModule,
    LogTransactionsModule,
    HirePurchasePaymentModule
  ],
  controllers: [HirePurchaseLandController],
  providers: [HirePurchaseService, ContractService],
  exports: [HirePurchaseService]
})
export class HirePurchaseModule {}
