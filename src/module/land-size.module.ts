import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandSize } from 'src/entities/land-size.entity';
import { LandSizeService } from 'src/service/land-size.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LandSize])
  ],
  controllers: [],
  providers: [LandSizeService],
  exports: [LandSizeService]
})
export class LandSizeModule {}
