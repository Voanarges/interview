import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '@interview/shared-types';

@Controller('events/:eventId/registrations')
export class RegistrationsController {
  constructor(private registrationsService: RegistrationsService) {}

  @Post()
  create(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() dto: CreateRegistrationDto,
  ) {
    return this.registrationsService.create(eventId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findByEvent(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.registrationsService.findByEvent(eventId);
  }
}
