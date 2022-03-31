import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogDescription } from 'src/entities/log-description.entity';
import { LogDescriptionService } from 'src/service/log-description.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogDescription])
  ],
  controllers: [],
  providers: [LogDescriptionService],
  exports: [LogDescriptionService],
})
export class LogDescriptionModule {}
