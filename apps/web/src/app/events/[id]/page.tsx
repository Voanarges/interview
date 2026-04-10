'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Typography, Box, Chip, Card, CardContent, LinearProgress, CircularProgress, Divider,
} from '@mui/material';
import { CalendarMonth, People, Info } from '@mui/icons-material';
import { apiClient } from '@/shared/api';
import { RegistrationForm } from '@/features/registration-form';
import { EventStatus, type IEvent } from '@interview/shared-types';

const statusConfig: Record<EventStatus, { label: string; color: 'success' | 'info' | 'default' }> = {
  [EventStatus.REGISTRATION_OPEN]: { label: 'Registration Open', color: 'success' },
  [EventStatus.PLANNED]: { label: 'Planned', color: 'info' },
  [EventStatus.COMPLETED]: { label: 'Completed', color: 'default' },
};

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = useCallback(() => {
    apiClient.get<IEvent>(`/events/${params.id}`)
      .then(({ data }) => setEvent(data))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => { fetchEvent(); }, [fetchEvent]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (!event) return <Typography>Event not found</Typography>;

  const occupancy = event.maxParticipants > 0
    ? Math.round((event.registeredCount / event.maxParticipants) * 100) : 0;
  const { label, color } = statusConfig[event.status];
  const isFull = event.registeredCount >= event.maxParticipants;
  const isOpen = event.status === EventStatus.REGISTRATION_OPEN;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h4" sx={{ flex: 1 }}>{event.title}</Typography>
        <Chip label={label} color={color} />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 3, color: 'text.secondary' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarMonth fontSize="small" />
          <Typography variant="body1">
            {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <People fontSize="small" />
          <Typography variant="body1">{event.registeredCount} / {event.maxParticipants} participants</Typography>
        </Box>
      </Box>

      <LinearProgress variant="determinate" value={occupancy} sx={{
        height: 8, borderRadius: 4, mb: 3,
        '& .MuiLinearProgress-bar': {
          backgroundColor: occupancy >= 90 ? 'error.main' : occupancy >= 60 ? 'warning.main' : 'success.main',
        },
      }} />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Info fontSize="small" color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>About this event</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
            {event.description}
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 2 }} />

      <RegistrationForm eventId={event.id} isFull={isFull} isOpen={isOpen} onSuccess={fetchEvent} />
    </Box>
  );
}
