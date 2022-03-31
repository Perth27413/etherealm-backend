import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandMarketController } from 'src/controller/land-market.controller';
import { LandMarket } from 'src/entities/land-market.entity';
import { LandMarketService } from 'src/service/land-market.service';
import { LandModule } from './land.module';
import { MarketTypeModule } from './market-type.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LandMarket]),
    UserModule,
    LandModule,
    MarketTypeModule
  ],
  controllers: [LandMarketController],
  providers: [LandMarketService],
  exports: [LandMarketService]
})
export class LandMarketModule {}
