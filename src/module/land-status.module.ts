import { Module } from '@nestjs/common';
import { LandStatusService } from '../service/land-status.service';
import { LandStatusController } from '../controller/land-status.controller';
import { LandStatus } from 'src/entities/land-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([LandStatus])
  ],
  controllers: [LandStatusController],
  providers: [LandStatusService]
})
export class LandStatusModule {}
