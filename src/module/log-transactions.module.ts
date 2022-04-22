import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogTransactions } from 'src/entities/log-transactions.entity';
import { LogTransactionsService } from 'src/service/log-transactions.service';
import { UserModule } from './user.module';
import { LogTypeModule } from './log-type.module';
import TransactionController from 'src/controller/transaction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogTransactions]),
    UserModule,
    LogTypeModule
  ],
  controllers: [TransactionController],
  providers: [LogTransactionsService],
  exports: [LogTransactionsService]
})
export class LogTransactionsModule {}
