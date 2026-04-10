'use client';
import { Typography, Button, Box, Container } from '@mui/material';
import { Event as EventIcon, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
      <Box sx={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        mx: 'auto', mb: 3,
      }}>
        <EventIcon sx={{ fontSize: 40, color: 'white' }} />
      </Box>

      <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
        EventHub
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
        Discover and register for upcoming events. Manage your events with ease.
      </Typography>

      <Button
        component={Link}
        href="/events"
        variant="contained"
        size="large"
        endIcon={<ArrowForward />}
        sx={{ px: 4, py: 1.5 }}
      >
        Browse Events
      </Button>
    </Container>
  );
}
