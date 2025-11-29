import { createBooking, getDailySchedule } from '@/api/booking';
import { getFields } from '@/modules/field/services';
import { useToast } from '@/hooks';
import { RoutePaths } from '@/constants/routes';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { addDays, format } from 'date-fns';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { CustomerNavBar } from '../components/CustomerNavBar';

const BookFieldPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [fields, setFields] = useState<any[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState(searchParams.get('fieldId') || '');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFields();
  }, []);

  useEffect(() => {
    if (selectedFieldId && selectedDate) {
      fetchSchedule();
    }
  }, [selectedFieldId, selectedDate]);

  const fetchFields = async () => {
    try {
      const response = await getFields();
      setFields(response);
    } catch (error) {
      showToast('Failed to load fields', 'error');
    }
  };

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const schedule = await getDailySchedule(selectedFieldId, selectedDate);
      // Generate available time slots
      const slots: string[] = [];
      for (let hour = 6; hour <= 22; hour++) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        const endTimeStr = `${(hour + 1).toString().padStart(2, '0')}:00`;
        
        // Check if slot is available
        const isBooked = schedule.some((booking: any) => {
          return booking.startTime === timeStr || (booking.startTime < timeStr && booking.endTime > timeStr);
        });
        
        if (!isBooked) {
          slots.push(`${timeStr} - ${endTimeStr}`);
        }
      }
      setTimeSlots(slots);
    } catch (error) {
      showToast('Failed to load schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFieldId || !selectedDate || !selectedSlot) {
      showToast('Please select all fields', 'error');
      return;
    }

    const [startTime, endTime] = selectedSlot.split(' - ');
    setSubmitting(true);
    try {
      await createBooking({
        fieldId: selectedFieldId,
        date: selectedDate,
        startTime,
        endTime,
      });
      showToast('Booking created successfully!', 'success');
      navigate(RoutePaths.MY_BOOKINGS);
    } catch (error) {
      showToast('Failed to create booking', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <CustomerNavBar />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Book a Field
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Select your preferred date and time
        </Typography>

        <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Field</InputLabel>
              <Select
                value={selectedFieldId}
                onChange={(e) => setSelectedFieldId(e.target.value)}
                label="Select Field"
              >
                {fields.map((field) => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.name} - {field.pricePerHour?.toLocaleString()} VND/hour
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedField && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {selectedField.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {selectedField.type} | Size: {selectedField.size}
                </Typography>
                {selectedField.location && (
                  <Typography variant="body2" color="text.secondary">
                    Location: {selectedField.location}
                  </Typography>
                )}
              </Box>
            )}

            <TextField
              fullWidth
              type="date"
              label="Select Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              inputProps={{
                min: format(new Date(), 'yyyy-MM-dd'),
                max: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
              }}
              sx={{ mb: 3 }}
            />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : timeSlots.length > 0 ? (
              <>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Select Time Slot</InputLabel>
                  <Select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    label="Select Time Slot"
                  >
                    {timeSlots.map((slot) => (
                      <MenuItem key={slot} value={slot}>
                        {slot}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedSlot && selectedField && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'success.light',
                      color: 'success.dark',
                      borderRadius: 1,
                      mb: 3,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Total: {selectedField.pricePerHour?.toLocaleString()} VND
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              selectedFieldId && selectedDate && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No available time slots for this date. Please select another date.
                </Typography>
              )
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                disabled={!selectedFieldId || !selectedDate || !selectedSlot || submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : null}
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default BookFieldPage;
