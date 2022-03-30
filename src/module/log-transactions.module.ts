import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogTransactions } from 'src/entities/log-transactions.entity';
import { LogTransactionsService } from 'src/service/log-transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogTransactions])
  ],
  controllers: [],
  providers: [LogTransactionsService],
  exports: [LogTransactionsService]
})
export class LogTransactionsModule {}
