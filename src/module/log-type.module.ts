import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogType } from 'src/entities/log-type.entity';
import { LogTypeService } from 'src/service/log-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogType])
  ],
  controllers: [],
  providers: [LogTypeService],
  exports: [LogTypeService],
})
export class LogTypeModule {}
