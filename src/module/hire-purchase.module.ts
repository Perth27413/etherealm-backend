import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandModule } from './land.module';
import { HirePurchase } from 'src/entities/hire-purchase.entity';
import { HirePurchaseService } from 'src/service/hire-purchase.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HirePurchase]),
    LandModule,
  ],
  controllers: [],
  providers: [HirePurchaseService],
  exports: [HirePurchaseService]
})
export class HirePurchaseModule {}
