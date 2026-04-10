import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { Registration } from '../registrations/entities/registration.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
    @InjectRepository(Registration)
    private registrationsRepository: Repository<Registration>,
  ) {}

  async getStatistics() {
    const totalEvents = await this.eventsRepository.count();
    const totalRegistrations = await this.registrationsRepository.count();

    const events = await this.eventsRepository.find({
      order: { date: 'ASC' },
    });

    const eventStats = events.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date.toISOString(),
      maxParticipants: event.maxParticipants,
      registeredCount: event.registeredCount,
      occupancyPercent:
        event.maxParticipants > 0
          ? Math.round((event.registeredCount / event.maxParticipants) * 100)
          : 0,
      status: event.status,
    }));

    return { totalEvents, totalRegistrations, eventStats };
  }
}
