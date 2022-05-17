import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HirePurchasePayment } from 'src/entities/hire-purchase-payment.entity';
import { HirePurchasePaymentService } from 'src/service/hire-purchase-payment.service';
import { HirePurchaseModule } from './hire-purchase.module';
import { LogTransactionsModule } from './log-transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HirePurchasePayment]),
    LogTransactionsModule
  ],
  controllers: [],
  providers: [HirePurchasePaymentService],
  exports: [HirePurchasePaymentService]
})
export class HirePurchasePaymentModule {}
