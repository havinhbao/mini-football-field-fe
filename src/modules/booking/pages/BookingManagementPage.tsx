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
import { useToast } from '@/hooks';
import { getFields } from '@/modules/field/services';
import { Add, CalendarMonth, List } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  const { showToast } = useToast();
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

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getBookings({ limit: 1000 });
      setBookings(response.data as Booking[]);
    } catch (error) {
      showToast('Tải danh sách đặt sân thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFields = async () => {
    try {
      const response = await getFields();
      setFields(response);
    } catch (error) {
      showToast('Tải danh sách sân thất bại', 'error');
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchFields();
  }, []);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [bookingToConfirm, setBookingToConfirm] = useState<string | null>(null);
  const [confirmPaymentMethod, setConfirmPaymentMethod] = useState<'cash' | 'banking' | 'momo'>(
    'cash',
  );

  const [confirmDepositAmount, setConfirmDepositAmount] = useState<number>(0);

  const handleCreateBooking = async (values: CreateBookingDto) => {
    try {
      if (selectedBooking?.id) {
        await updateBooking(selectedBooking.id, values);
        showToast('Cập nhật đặt sân thành công', 'success');
      } else {
        await createBooking(values);
        showToast('Tạo đặt sân thành công', 'success');
      }
      fetchBookings();
      setDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      showToast('Lưu đặt sân thất bại', 'error');
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
        showToast('Xóa đặt sân thành công', 'success');
        fetchBookings();
      } catch (error) {
        showToast('Xóa đặt sân thất bại', 'error');
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
      showToast('Hủy đặt sân thành công', 'success');
      fetchBookings();
      setCancelDialogOpen(false);
      setCancelReason('');
      setBookingToCancel(null);
    } catch (error) {
      showToast('Hủy đặt sân thất bại', 'error');
    }
  };

  const handleConfirmClick = (id: string) => {
    setBookingToConfirm(id);
    setConfirmPaymentMethod('cash');
    setConfirmDepositAmount(0);

    const booking = bookings.find((b) => b.id === id);
    if (booking) {
      setConfirmDepositAmount(booking.totalPrice);
    }

    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!bookingToConfirm) return;
    try {
      // If isDeposit is false (meaning full payment or no payment), we send undefined for depositAmount if it's not a payment scenario
      // But here we want to support payment during confirmation.
      // If user wants to just confirm without payment, they should probably have a way to do that.
      // Let's assume if they open this dialog, they might want to pay.
      // Or we can add a "Confirm without Payment" button?
      // The requirement says "if payment is cash, and admin confirm so that it can align with changes from backend".
      // So we should send payment details if provided.

      await confirmBooking(bookingToConfirm, {
        paymentMethod: confirmPaymentMethod,
        depositAmount: confirmDepositAmount,
      });

      showToast('Xác nhận đặt sân thành công', 'success');
      fetchBookings();
      setConfirmDialogOpen(false);
      setBookingToConfirm(null);
    } catch (error) {
      showToast('Xác nhận đặt sân thất bại', 'error');
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
      showToast('Thanh toán thành công', 'success');
      fetchBookings();
      setPayDialogOpen(false);
      setBookingToPay(null);
    } catch (error) {
      showToast('Thanh toán thất bại', 'error');
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
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        pt: 2,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 2 }}>
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
            Quản Lý Đặt Sân
          </Typography>
        </Box>

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
            <Tab icon={<CalendarMonth />} iconPosition="start" label="Lịch" />
            <Tab icon={<List />} iconPosition="start" label="Danh sách" />
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
            Đặt sân
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
                onConfirm={handleConfirmClick}
                onPay={handlePayClick}
              />
            )}
          </>
        )}

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
            <Button onClick={() => setCancelDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleCancelConfirm} variant="contained" color="warning">
              Xác nhận hủy
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Bạn có thể xác nhận đặt sân và ghi nhận thanh toán (nếu có) tại đây.
            </Typography>

            <TextField
              select
              fullWidth
              label="Payment Method"
              value={confirmPaymentMethod}
              onChange={(e) =>
                setConfirmPaymentMethod(e.target.value as 'cash' | 'banking' | 'momo')
              }
              sx={{ mb: 2 }}
              slotProps={{
                select: {
                  native: true,
                },
              }}
            >
              <option value="cash">Tiền mặt</option>
              <option value="banking">Chuyển khoản</option>
              <option value="momo">MoMo</option>
            </TextField>

            <TextField
              fullWidth
              label="Amount Received"
              type="number"
              value={confirmDepositAmount}
              onChange={(e) => setConfirmDepositAmount(Number(e.target.value))}
              helperText="Enter the amount received (full price or deposit)"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>Hủy</Button>
            <Button
              onClick={async () => {
                if (!bookingToConfirm) return;
                try {
                  // Confirm without payment
                  await confirmBooking(bookingToConfirm);
                  showToast('Booking confirmed successfully', 'success');
                  fetchBookings();
                  setConfirmDialogOpen(false);
                  setBookingToConfirm(null);
                } catch (error) {
                  showToast('Failed to confirm booking', 'error');
                }
              }}
              color="primary"
            >
              Xác nhận không thanh toán
            </Button>
            <Button onClick={handleConfirmSubmit} variant="contained" color="success">
              Xác nhận & Thanh toán
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
          <DialogTitle>Ghi nhận thanh toán</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Phương thức thanh toán"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'banking' | 'momo')}
              sx={{ mt: 2 }}
              slotProps={{
                select: {
                  native: true,
                },
              }}
            >
              <option value="cash">Tiền mặt</option>
              <option value="banking">Chuyển khoản</option>
              <option value="momo">MoMo</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPayDialogOpen(false)}>Hủy</Button>
            <Button onClick={handlePayConfirm} variant="contained" color="success">
              Xác nhận thanh toán
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default BookingManagementPage;
