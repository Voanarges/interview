import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Event } from '../events/entities/event.entity';
import { Registration } from '../registrations/entities/registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Registration])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
