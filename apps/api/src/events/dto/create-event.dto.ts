import {
  IsString,
  IsDateString,
  IsInt,
  Min,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { EventStatus } from '@interview/shared-types';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsInt()
  @Min(1)
  maxParticipants: number;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
