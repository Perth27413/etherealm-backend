import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OfferLandController from 'src/controller/offer-land.controller';
import { OfferLand } from 'src/entities/offer-land.entity';
import { OfferLandService } from 'src/service/offer-land.service';
import { LandModule } from './land.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfferLand]),
    LandModule,
    UserModule
  ],
  controllers: [OfferLandController],
  providers: [OfferLandService],
  exports: [OfferLandService]
})
export class OfferLandModule {}
