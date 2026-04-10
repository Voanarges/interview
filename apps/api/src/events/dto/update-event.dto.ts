import {
  IsString,
  IsDateString,
  IsInt,
  Min,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { EventStatus } from '@interview/shared-types';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxParticipants?: number;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
