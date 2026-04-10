import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
  ) {}

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.eventsRepository.findAndCount({
      order: { date: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['registrations'],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async create(dto: CreateEventDto) {
    const event = this.eventsRepository.create(dto);
    return this.eventsRepository.save(event);
  }

  async update(id: number, dto: UpdateEventDto) {
    const event = await this.findOne(id);
    Object.assign(event, dto);
    return this.eventsRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
    return { deleted: true };
  }
}
