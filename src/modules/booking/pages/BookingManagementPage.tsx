import {
  cancelBooking,
  confirmBooking,
  createBooking,
  CreateBookingDto,
  deleteBooking,
  getBookings,
  payBooking,
  PayBookingDto,
  updateBooking,
} from '@/api/booking';
import { getFields } from '@/modules/field/services';
import { Add, CalendarMonth, List } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { BookingCalendar } from '../components/BookingCalendar';
import { BookingDialog } from '../components/BookingDialog';
import { BookingList } from '../components/BookingList';
import { Booking } from '../types';

interface Field {
  id: string;
  name: string;
  pricePerHour: number;
}

const BookingManagementPage: FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [bookingToPay, setBookingToPay] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'banking' | 'momo'>('cash');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getBookings({ limit: 1000 });
      setBookings(response.data as Booking[]);
    } catch (error) {
      showSnackbar('Failed to fetch bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFields = async () => {
    try {
      const response = await getFields();
      setFields(response);
    } catch (error) {
      showSnackbar('Failed to fetch fields', 'error');
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchFields();
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateBooking = async (values: CreateBookingDto) => {
    try {
      if (selectedBooking?.id) {
        await updateBooking(selectedBooking.id, values);
        showSnackbar('Booking updated successfully', 'success');
      } else {
        await createBooking(values);
        showSnackbar('Booking created successfully', 'success');
      }
      fetchBookings();
      setDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      showSnackbar('Failed to save booking', 'error');
    }
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(id);
        showSnackbar('Booking deleted successfully', 'success');
        fetchBookings();
      } catch (error) {
        showSnackbar('Failed to delete booking', 'error');
      }
    }
  };

  const handleCancelClick = (id: string) => {
    setBookingToCancel(id);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;
    try {
      await cancelBooking(bookingToCancel, cancelReason, false);
      showSnackbar('Booking canceled successfully', 'success');
      fetchBookings();
      setCancelDialogOpen(false);
      setCancelReason('');
      setBookingToCancel(null);
    } catch (error) {
      showSnackbar('Failed to cancel booking', 'error');
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await confirmBooking(id);
      showSnackbar('Booking confirmed successfully', 'success');
      fetchBookings();
    } catch (error) {
      showSnackbar('Failed to confirm booking', 'error');
    }
  };

  const handlePayClick = (id: string) => {
    setBookingToPay(id);
    setPayDialogOpen(true);
  };

  const handlePayConfirm = async () => {
    if (!bookingToPay) return;
    try {
      const payload: PayBookingDto = { paymentMethod };
      await payBooking(bookingToPay, payload);
      showSnackbar('Payment recorded successfully', 'success');
      fetchBookings();
      setPayDialogOpen(false);
      setBookingToPay(null);
    } catch (error) {
      showSnackbar('Failed to record payment', 'error');
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedBooking({
      id: '',
      fieldId: '',
      date,
      startTime: '09:00',
      endTime: '10:00',
      status: 'pending',
      paymentStatus: 'unpaid',
      totalPrice: 0,
    });
    setDialogOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Booking Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage your football field bookings with ease
          </Typography>
        </Box>

        {/* Tabs and Create Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              },
              '& .Mui-selected': {
                color: '#667eea',
              },
            }}
          >
            <Tab icon={<CalendarMonth />} iconPosition="start" label="Calendar View" />
            <Tab icon={<List />} iconPosition="start" label="List View" />
          </Tabs>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedBooking(null);
              setDialogOpen(true);
            }}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              },
            }}
          >
            New Booking
          </Button>
        </Box>

        {/* Content */}
        {loading && !bookings.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeTab === 0 && (
              <BookingCalendar
                bookings={bookings}
                onDateClick={handleDateClick}
                onBookingClick={(booking) => handleEdit(booking)}
              />
            )}

            {activeTab === 1 && (
              <BookingList
                bookings={bookings}
                loading={loading}
                onEdit={(booking) => handleEdit(booking)}
                onDelete={handleDelete}
                onCancel={handleCancelClick}
                onConfirm={handleConfirm}
                onPay={handlePayClick}
              />
            )}
          </>
        )}

        {/* Booking Dialog */}
        <BookingDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedBooking(null);
          }}
          onSubmit={(values) => handleCreateBooking(values as CreateBookingDto)}
          booking={selectedBooking ?? undefined}
          fields={fields}
        />

        {/* Cancel Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Cancel Booking</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Cancellation Reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCancelConfirm} variant="contained" color="warning">
              Confirm Cancellation
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog
          open={payDialogOpen}
          onClose={() => setPayDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Record Payment</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'banking' | 'momo')}
              sx={{ mt: 2 }}
              slotProps={{
                select: {
                  native: true,
                },
              }}
            >
              <option value="cash">Cash</option>
              <option value="banking">Banking</option>
              <option value="momo">MoMo</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPayDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePayConfirm} variant="contained" color="success">
              Confirm Payment
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default BookingManagementPage;
