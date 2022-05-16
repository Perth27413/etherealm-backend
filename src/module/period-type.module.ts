import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodType } from 'src/entities/period-type.entity';
import { PeriodTypeService } from 'src/service/period-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PeriodType]),
  ],
  controllers: [],
  providers: [PeriodTypeService],
  exports: [PeriodTypeService]
})
export class PeriodTypeModule {}
