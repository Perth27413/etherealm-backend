import { forwardRef, Module } from '@nestjs/common';
import { LandService } from '../service/land.service';
import { LandController } from '../controller/land.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Land } from 'src/entities/land.entity';
import { LandStatus } from 'src/entities/land-status.entity';
import { LandStatusModule } from './land-status.module';
import { LandSizeModule } from './land-size.module';
import { LandMarketModule } from './land-market.module';
import { LandMarket } from 'src/entities/land-market.entity';
import { ContractService } from 'src/service/contract.service';
import { OfferLandService } from 'src/service/offer-land.service';
import { OfferLandModule } from './offer-land.module';
import { OfferLand } from 'src/entities/offer-land.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Land, LandStatus, LandMarket, OfferLand]),
    LandStatusModule,
    LandSizeModule
  ],
  controllers: [LandController],
  providers: [LandService, ContractService],
  exports: [LandService]
})
export class LandModule {}
