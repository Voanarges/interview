'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography, Box, Card, CardContent, CircularProgress, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress,
} from '@mui/material';
import { Event as EventIcon, People, BarChart } from '@mui/icons-material';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiClient } from '@/shared/api';
import { useAuth } from '@/features/auth';
import { UserRole, EventStatus, type IStatistics } from '@interview/shared-types';

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: 2, backgroundColor: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<IStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== UserRole.ADMIN)) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    apiClient.get<IStatistics>('/statistics')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (authLoading || loading || !stats) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }

  const avgOccupancy = stats.eventStats.length > 0
    ? Math.round(stats.eventStats.reduce((sum, e) => sum + e.occupancyPercent, 0) / stats.eventStats.length)
    : 0;

  const chartData = stats.eventStats.map((e) => ({
    name: e.title.length > 15 ? e.title.slice(0, 15) + '...' : e.title,
    registered: e.registeredCount,
    capacity: e.maxParticipants,
  }));

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>Analytics</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        <StatCard icon={<EventIcon />} label="Total Events" value={stats.totalEvents} color="#6366f1" />
        <StatCard icon={<People />} label="Total Registrations" value={stats.totalRegistrations} color="#ec4899" />
        <StatCard icon={<BarChart />} label="Avg Occupancy" value={`${avgOccupancy}%`} color="#22c55e" />
      </Box>

      {chartData.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Registrations vs Capacity</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="registered" fill="#6366f1" name="Registered" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" fill="#e2e8f0" name="Capacity" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Occupancy</TableCell>
              <TableCell>Participants</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.eventStats.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{new Date(event.date).toLocaleDateString('ru-RU')}</TableCell>
                <TableCell>
                  <Chip size="small" label={event.status.replace('_', ' ')}
                    color={event.status === EventStatus.REGISTRATION_OPEN ? 'success' : event.status === EventStatus.PLANNED ? 'info' : 'default'} />
                </TableCell>
                <TableCell sx={{ minWidth: 150 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress variant="determinate" value={event.occupancyPercent} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
                    <Typography variant="body2">{event.occupancyPercent}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>{event.registeredCount}/{event.maxParticipants}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
