import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandModule } from './land.module';
import { RentLandService } from 'src/service/rent-land.service';
import { RentLand } from 'src/entities/rent-land.entity';
import { RentTypeModule } from './rent-type.module';
import { PeriodTypeModule } from './period-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RentLand]),
    LandModule,
    RentTypeModule,
    PeriodTypeModule
  ],
  controllers: [],
  providers: [RentLandService],
  exports: [RentLandService]
})
export class RentLandModule {}
