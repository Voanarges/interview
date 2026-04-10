export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum EventStatus {
  PLANNED = 'planned',
  REGISTRATION_OPEN = 'registration_open',
  COMPLETED = 'completed',
}

export interface IUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface IEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  maxParticipants: number;
  status: EventStatus;
  registeredCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IRegistration {
  id: number;
  eventId: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface IStatistics {
  totalEvents: number;
  totalRegistrations: number;
  eventStats: IEventStat[];
}

export interface IEventStat {
  id: number;
  title: string;
  date: string;
  maxParticipants: number;
  registeredCount: number;
  occupancyPercent: number;
  status: EventStatus;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface ICreateEventRequest {
  title: string;
  description: string;
  date: string;
  maxParticipants: number;
  status?: EventStatus;
}

export interface ICreateRegistrationRequest {
  name: string;
  email: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
