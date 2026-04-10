'use client';
import { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Pagination } from '@mui/material';
import { apiClient } from '@/shared/api';
import { EventCard } from '@/entities/event';
import type { IEvent, IPaginatedResponse } from '@interview/shared-types';

export default function EventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;

  useEffect(() => {
    setLoading(true);
    apiClient.get<IPaginatedResponse<IEvent>>(`/events?page=${page}&limit=${limit}`)
      .then(({ data }) => { setEvents(data.data); setTotal(data.total); })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>Events</Typography>
      {events.length === 0 ? (
        <Typography color="text.secondary">No events found.</Typography>
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Box>
          {total > limit && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination count={Math.ceil(total / limit)} page={page} onChange={(_, p) => setPage(p)} color="primary" />
            </Box>
          )}
        </>
      )}
    </>
  );
}
