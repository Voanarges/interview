import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { Event } from '../events/entities/event.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { EventStatus } from '@interview/shared-types';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private registrationsRepository: Repository<Registration>,
    private dataSource: DataSource,
  ) {}

  async create(eventId: number, dto: CreateRegistrationDto) {
    return this.dataSource.transaction(async (manager) => {
      const event = await manager.findOne(Event, {
        where: { id: eventId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!event) {
        throw new BadRequestException('Event not found');
      }

      if (event.status !== EventStatus.REGISTRATION_OPEN) {
        throw new BadRequestException('Registration is not open for this event');
      }

      if (event.registeredCount >= event.maxParticipants) {
        throw new BadRequestException('No spots available');
      }

      const existing = await manager.findOne(Registration, {
        where: { eventId, email: dto.email },
      });
      if (existing) {
        throw new ConflictException('Already registered for this event');
      }

      const registration = manager.create(Registration, {
        ...dto,
        eventId,
      });
      await manager.save(registration);

      event.registeredCount += 1;
      await manager.save(event);

      return registration;
    });
  }

  async findByEvent(eventId: number) {
    return this.registrationsRepository.find({
      where: { eventId },
      order: { createdAt: 'DESC' },
    });
  }
}
