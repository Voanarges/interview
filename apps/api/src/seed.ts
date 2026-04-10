import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/entities/user.entity';
import { Event } from './events/entities/event.entity';
import { Registration } from './registrations/entities/registration.entity';
import { UserRole } from '@interview/shared-types';
import { EventStatus } from '@interview/shared-types';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../apps/api/.env') });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env['DATABASE_HOST'] || 'localhost',
  port: parseInt(process.env['DATABASE_PORT'] || '5433', 10),
  username: process.env['DATABASE_USERNAME'] || 'interview',
  password: process.env['DATABASE_PASSWORD'] || 'interview123',
  database: process.env['DATABASE_NAME'] || 'interview',
  entities: [User, Event, Registration],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('Database connected');

  const userRepo = dataSource.getRepository(User);
  const eventRepo = dataSource.getRepository(Event);

  const existingAdmin = await userRepo.findOne({
    where: { email: 'admin@example.com' },
  });

  if (!existingAdmin) {
    const admin = userRepo.create({
      email: 'admin@example.com',
      name: 'Admin',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
    });
    await userRepo.save(admin);
    console.log('Admin user created: admin@example.com');
  }

  const eventsCount = await eventRepo.count();
  if (eventsCount === 0) {
    const events = eventRepo.create([
      {
        title: 'Tech Conference 2026',
        description: 'Annual technology conference with top speakers from around the world.',
        date: new Date('2026-06-15'),
        maxParticipants: 100,
        status: EventStatus.REGISTRATION_OPEN,
        registeredCount: 0,
      },
      {
        title: 'JavaScript Meetup',
        description: 'Monthly meetup for JavaScript enthusiasts. Networking and talks.',
        date: new Date('2026-05-20'),
        maxParticipants: 30,
        status: EventStatus.REGISTRATION_OPEN,
        registeredCount: 0,
      },
      {
        title: 'AI Workshop',
        description: 'Hands-on workshop on building AI applications with modern tools.',
        date: new Date('2026-07-10'),
        maxParticipants: 20,
        status: EventStatus.PLANNED,
        registeredCount: 0,
      },
      {
        title: 'Startup Pitch Night',
        description: 'Pitch your startup idea to investors and get feedback.',
        date: new Date('2026-04-01'),
        maxParticipants: 50,
        status: EventStatus.COMPLETED,
        registeredCount: 45,
      },
    ]);
    await eventRepo.save(events);
    console.log('Sample events created');
  }

  await dataSource.destroy();
  console.log('Seed completed');
}

seed().catch(console.error);
