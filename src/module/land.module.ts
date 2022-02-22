import { Module } from '@nestjs/common';
import { LandService } from '../service/land.service';
import { LandController } from '../controller/land.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Land } from 'src/entities/land.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Land])
  ],
  controllers: [LandController],
  providers: [LandService]
})
export class LandModule {}
