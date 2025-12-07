import { getMyBookings } from '@/api/booking';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { BookingCard } from '../components/BookingCard';
import { CustomerNavBar } from '../components/CustomerNavBar';

const MyBookingsPage: FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getMyBookings({ limit: 100 });
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Box sx={{ bgcolor: '#f5f7fa', height: '100vh' }}>
      <CustomerNavBar />

      <Box
        sx={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
            Lịch đặt sân của tôi
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : bookings.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Chưa có đặt sân nào
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 3, bgcolor: 'primary.main' }}
                onClick={() => navigate('/')}
              >
                Duyệt sân
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onUpdate={fetchBookings} />
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default MyBookingsPage;
