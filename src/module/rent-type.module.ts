import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentType } from 'src/entities/rent-type.entity';
import { RentTypeService } from 'src/service/rent-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RentType]),
  ],
  controllers: [],
  providers: [RentTypeService],
  exports: [RentTypeService]
})
export class RentTypeModule {}
