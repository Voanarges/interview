'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card, CardContent, Typography, TextField, Button, Alert, Box, Tabs, Tab,
} from '@mui/material';
import { useAuth } from '@/features/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 0) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      router.push('/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 8 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
            Welcome to EventHub
          </Typography>

          <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); }} centered sx={{ mb: 3 }}>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            {tab === 1 && (
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)}
                fullWidth required sx={{ mb: 2 }} />
            )}
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              fullWidth required sx={{ mb: 2 }} />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              fullWidth required sx={{ mb: 3 }} slotProps={{ htmlInput: { minLength: 6 } }} />
            <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
              {loading ? 'Please wait...' : tab === 0 ? 'Login' : 'Create Account'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
