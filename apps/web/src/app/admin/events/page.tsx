'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Box, CircularProgress, Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { apiClient } from '@/shared/api';
import { useAuth } from '@/features/auth';
import { EventStatus, UserRole, type IEvent, type IPaginatedResponse } from '@interview/shared-types';

const statusOptions = [
  { value: EventStatus.PLANNED, label: 'Planned' },
  { value: EventStatus.REGISTRATION_OPEN, label: 'Registration Open' },
  { value: EventStatus.COMPLETED, label: 'Completed' },
];

const defaultForm = { title: '', description: '', date: '', maxParticipants: 50, status: EventStatus.PLANNED };

export default function AdminEventsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== UserRole.ADMIN)) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchEvents = () => {
    setLoading(true);
    apiClient.get<IPaginatedResponse<IEvent>>('/events?limit=100')
      .then(({ data }) => setEvents(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSave = async () => {
    setError('');
    try {
      if (editingId) {
        await apiClient.put(`/events/${editingId}`, form);
      } else {
        await apiClient.post('/events', form);
      }
      setDialogOpen(false);
      setEditingId(null);
      setForm(defaultForm);
      fetchEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleEdit = (event: IEvent) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      maxParticipants: event.maxParticipants,
      status: event.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this event?')) return;
    await apiClient.delete(`/events/${id}`);
    fetchEvents();
  };

  if (authLoading || loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Manage Events</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingId(null); setForm(defaultForm); setDialogOpen(true); }}>
          New Event
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Participants</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} hover>
                <TableCell>{event.title}</TableCell>
                <TableCell>{new Date(event.date).toLocaleDateString('ru-RU')}</TableCell>
                <TableCell>
                  <Chip label={statusOptions.find(s => s.value === event.status)?.label} size="small"
                    color={event.status === EventStatus.REGISTRATION_OPEN ? 'success' : event.status === EventStatus.PLANNED ? 'info' : 'default'} />
                </TableCell>
                <TableCell>{event.registeredCount}/{event.maxParticipants}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEdit(event)}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(event.id)}><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Event' : 'Create Event'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
          <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            fullWidth required sx={{ mt: 2, mb: 2 }} />
          <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth multiline rows={3} sx={{ mb: 2 }} />
          <TextField label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
            fullWidth required sx={{ mb: 2 }} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="Max Participants" type="number" value={form.maxParticipants}
            onChange={(e) => setForm({ ...form, maxParticipants: parseInt(e.target.value) || 1 })}
            fullWidth sx={{ mb: 2 }} slotProps={{ htmlInput: { min: 1 } }} />
          <TextField label="Status" select value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as EventStatus })} fullWidth>
            {statusOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
