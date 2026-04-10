'use client';
import { useState } from 'react';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { apiClient } from '@/shared/api';

interface Props {
  eventId: number;
  isFull: boolean;
  isOpen: boolean;
  onSuccess: () => void;
}

export default function RegistrationForm({ eventId, isFull, isOpen, onSuccess }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Registration is not open for this event yet.
      </Alert>
    );
  }

  if (isFull) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        <Typography sx={{ fontWeight: 600 }}>No spots available</Typography>
        All spots for this event have been taken.
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        You have been registered successfully!
      </Alert>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post(`/events/${eventId}/registrations`, { name, email });
      setSuccess(true);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Register for this event</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField label="Your Name" value={name} onChange={(e) => setName(e.target.value)}
        fullWidth required sx={{ mb: 2 }} size="small" />
      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        fullWidth required sx={{ mb: 2 }} size="small" />
      <Button type="submit" variant="contained" disabled={loading} startIcon={<PersonAdd />} fullWidth>
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </Box>
  );
}
