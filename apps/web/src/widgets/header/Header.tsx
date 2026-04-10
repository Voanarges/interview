'use client';
import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material';
import { Event as EventIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/features/auth';
import { UserRole } from '@interview/shared-types';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid', borderColor: 'grey.200' }}>
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto' }}>
        <EventIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{ color: 'text.primary', textDecoration: 'none', fontWeight: 700, flexGrow: 0, mr: 3 }}
        >
          EventHub
        </Typography>

        <Button component={Link} href="/events" sx={{ color: 'text.secondary' }}>Events</Button>

        {user?.role === UserRole.ADMIN && (
          <>
            <Button component={Link} href="/admin/events" sx={{ color: 'text.secondary' }}>Manage</Button>
            <Button component={Link} href="/admin/analytics" sx={{ color: 'text.secondary' }}>Analytics</Button>
          </>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={user.name} size="small" variant="outlined" />
            {user.role === UserRole.ADMIN && <Chip label="Admin" size="small" color="primary" />}
            <Button onClick={logout} variant="outlined" size="small">Logout</Button>
          </Box>
        ) : (
          <Button component={Link} href="/login" variant="contained" size="small">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
