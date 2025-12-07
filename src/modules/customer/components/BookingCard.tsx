import { cancelBooking } from '@/api/booking';
import { useToast } from '@/hooks';
import { CalendarToday, Cancel, Schedule } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material';
import { format } from 'date-fns';
import { FC, useState } from 'react';

interface BookingCardProps {
  booking: {
    id: string;
    field?: {
      name: string;
      location?: string;
    };
    date: Date;
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: string;
    paymentStatus: string;
  };
  onUpdate?: () => void;
}

export const BookingCard: FC<BookingCardProps> = ({ booking, onUpdate }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đặt sân này không?')) return;

    setLoading(true);
    try {
      await cancelBooking(booking.id, 'Canceled by customer', false);
      showToast('Hủy đặt sân thành công', 'success');
      onUpdate?.();
    } catch (error) {
      showToast('Không thể hủy đặt sân', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'canceled':
        return 'error';
      case 'paid':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {booking.field?.name || 'Unknown Field'}
          </Typography>
          <Chip
            label={booking.status}
            color={getStatusColor(booking.status)}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {format(new Date(booking.date), 'PPP')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {booking.startTime} - {booking.endTime}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
            {booking.totalPrice.toLocaleString()} VND
          </Typography>

          {booking.status !== 'canceled' && booking.status !== 'paid' && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Cancel />}
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy đặt sân
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
