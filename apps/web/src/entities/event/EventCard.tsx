'use client';
import { Card, CardContent, CardActions, Typography, Chip, Button, Box, LinearProgress } from '@mui/material';
import { CalendarMonth, People } from '@mui/icons-material';
import { IEvent, EventStatus } from '@interview/shared-types';
import Link from 'next/link';

const statusConfig: Record<EventStatus, { label: string; color: 'success' | 'info' | 'default' }> = {
  [EventStatus.REGISTRATION_OPEN]: { label: 'Registration Open', color: 'success' },
  [EventStatus.PLANNED]: { label: 'Planned', color: 'info' },
  [EventStatus.COMPLETED]: { label: 'Completed', color: 'default' },
};

export default function EventCard({ event }: { event: IEvent }) {
  const { label, color } = statusConfig[event.status];
  const occupancy = event.maxParticipants > 0
    ? Math.round((event.registeredCount / event.maxParticipants) * 100)
    : 0;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="h6" component="h2" sx={{ flex: 1, mr: 1 }}>
            {event.title}
          </Typography>
          <Chip label={label} color={color} size="small" />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {event.description.length > 120 ? event.description.slice(0, 120) + '...' : event.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 1.5, color: 'text.secondary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarMonth fontSize="small" />
            <Typography variant="body2">
              {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <People fontSize="small" />
            <Typography variant="body2">
              {event.registeredCount}/{event.maxParticipants}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 0.5 }}>
          <LinearProgress
            variant="determinate"
            value={occupancy}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                backgroundColor: occupancy >= 90 ? 'error.main' : occupancy >= 60 ? 'warning.main' : 'success.main',
              },
            }}
          />
          <Typography variant="caption" color="text.secondary">{occupancy}% filled</Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button component={Link} href={`/events/${event.id}`} variant="outlined" size="small" fullWidth>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
