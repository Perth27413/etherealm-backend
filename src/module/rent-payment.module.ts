import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentPayment } from 'src/entities/rent-payment.entity';
import { RentPaymentService } from 'src/service/rent-payment.service';
import { LogTransactionsModule } from './log-transactions.module';
import { RentLandModule } from './rent-land.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RentPayment]),
    LogTransactionsModule,
    UserModule
  ],
  controllers: [],
  providers: [RentPaymentService],
  exports: [RentPaymentService]
})
export class RentPaymentModule {}
