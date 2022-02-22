import { Module } from '@nestjs/common';
import { LandStatusService } from '../service/land-status.service';
import { LandStatus } from 'src/entities/land-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([LandStatus])
  ],
  controllers: [],
  providers: [LandStatusService],
  exports: [LandStatusService]
})
export class LandStatusModule {}
