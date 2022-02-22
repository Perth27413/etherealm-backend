import { Module } from '@nestjs/common';
import { LandService } from '../service/land.service';
import { LandController } from '../controller/land.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Land } from 'src/entities/land.entity';
import { LandStatus } from 'src/entities/land-status.entity';
import { LandStatusModule } from './land-status.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Land, LandStatus]),
    LandStatusModule
  ],
  controllers: [LandController],
  providers: [LandService]
})
export class LandModule {}
