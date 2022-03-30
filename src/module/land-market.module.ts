import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandMarket } from 'src/entities/land-market.entity';
import { LandMarketService } from 'src/service/land-market.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LandMarket])
  ],
  controllers: [],
  providers: [LandMarketService],
  exports: [LandMarketService]
})
export class LandMarketModule {}
