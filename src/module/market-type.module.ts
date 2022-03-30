import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketType } from 'src/entities/market-type.entity';
import { MarketTypeService } from 'src/service/market-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketType])
  ],
  controllers: [],
  providers: [MarketTypeService],
  exports: [MarketTypeService]
})
export class MarketTypeModule {}
