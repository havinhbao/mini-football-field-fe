import { createBooking, getPaymentURL, payment } from '@/api/booking';
import { useToast } from '@/hooks';
import { RoutePaths } from '@/constants/routes';
import { CheckCircle, CreditCard, QrCode2, Schedule } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { CustomerNavBar } from '../components/CustomerNavBar';
import { buildPriceString } from '@/utils';

interface BookingData {
  fieldId: string;
  date: string;
  startTime: string;
  endTime: string;
  amount: number;
}

const VNPayPaymentPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(dataParam));
        console.log(decoded);
        setBookingData(decoded);
      } catch (error) {
        showToast('Invalid booking data', 'error');
        navigate(RoutePaths.BOOK_FIELD);
      }
    } else {
      navigate(RoutePaths.BOOK_FIELD);
    }
  }, [searchParams]);

  // useEffect(() => {
  //   const fetchURL = async () => {
  //     if (!bookingData) return;
  //     const data = await getPaymentURL({
  //       orderInfo: `"dat_san_tu_${bookingData.startTime}_den_${bookingData.endTime}"`,
  //       amount: bookingData.amount,
  //       orderId: bookingData.amount,
  //     });
  //     setUrlVnpay(data.paymentUrl);
  //   };
  //   fetchURL();
  // }, []);

  const handleGenerateQR = async () => {
    // create booking
    if (!bookingData) return;
    const bookingRes = await createBooking({
      fieldId: bookingData.fieldId,
      date: bookingData.date,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
    });

    console.log(bookingRes);
    // create url
    const data = await getPaymentURL({
      orderInfo: `"dat_san_tu_${bookingData.startTime}_den_${bookingData.endTime}"`,
      amount: bookingRes.totalPrice,
      orderId: bookingRes.id,
    });

    window.location.href = data.paymentUrl;
  };

  const handlePayment = async () => {
    if (!bookingData) return;

    setProcessing(true);
    // Simulate payment confirmation after QR scan
    setTimeout(async () => {
      try {
        await createBooking(bookingData);
        setPaymentStatus('success');
        showToast('Payment successful! Booking confirmed.', 'success');

        setTimeout(() => {
          navigate(RoutePaths.MY_BOOKINGS);
        }, 2000);
      } catch (error) {
        setPaymentStatus('failed');
        showToast('Payment failed. Please try again.', 'error');
      } finally {
        setProcessing(false);
      }
    }, 2000);
  };

  if (!bookingData) {
    return (
      <Box
        sx={{
          bgcolor: '#f5f7fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f7fa' }}>
      <CustomerNavBar />

      <Box
        sx={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(135deg, #0066CC 0%, #003D7A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CreditCard sx={{ fontSize: 40, color: '#0066CC' }} />
            VNPay Payment
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Scan QR code to complete your payment
          </Typography>

          {paymentStatus === 'success' ? (
            <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: 'success.light' }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 80, color: 'success.dark', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.dark', mb: 1 }}>
                  Payment Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Your booking has been confirmed. Redirecting to My Bookings...
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Booking Details */}
              <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Booking Details
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Schedule color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Date"
                        secondary={format(new Date(bookingData.date), 'PPP')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Schedule color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Time"
                        secondary={`${bookingData.startTime} - ${bookingData.endTime}`}
                      />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="h6">Total Amount:</Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                      {buildPriceString(bookingData.amount)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* QR Code Payment Section */}
              {showQR ? (
                <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Scan QR Code to Pay
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Open your banking app and scan this QR code
                      </Typography>

                      {/* QR Code Display */}
                      <Box
                        sx={{
                          width: 280,
                          height: 280,
                          margin: '0 auto',
                          bgcolor: 'white',
                          border: '2px solid #0066CC',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                          position: 'relative',
                        }}
                      >
                        {processing ? (
                          <CircularProgress />
                        ) : (
                          <Box sx={{ textAlign: 'center' }}>
                            <QrCode2 sx={{ fontSize: 240, color: '#0066CC' }} />
                            <Typography
                              variant="caption"
                              sx={{
                                position: 'absolute',
                                bottom: 8,
                                left: 0,
                                right: 0,
                                fontSize: 11,
                                color: 'text.secondary',
                              }}
                            >
                              VietQR - VNPay
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 1, mb: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          Supported Banking Apps:
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Vietcombank, TPBank, VietinBank, BIDV, Techcombank, MB Bank, ACB, and more
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handlePayment}
                        disabled={processing}
                        startIcon={processing ? <CircularProgress size={20} /> : <CheckCircle />}
                        sx={{
                          bgcolor: '#0066CC',
                          mb: 1,
                          '&:hover': {
                            bgcolor: '#003D7A',
                          },
                        }}
                      >
                        {processing ? 'Processing Payment...' : 'I Have Completed Payment'}
                      </Button>

                      <Button
                        variant="text"
                        fullWidth
                        onClick={() => setShowQR(false)}
                        disabled={processing}
                      >
                        Choose Another Method
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Payment Methods */}
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: 2,
                      background: 'linear-gradient(135deg, #0066CC 0%, #003D7A 100%)',
                      color: 'white',
                      mb: 3,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Choose Payment Method
                      </Typography>

                      <Box
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.1)',
                          p: 3,
                          borderRadius: 2,
                          mb: 2,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.2)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onClick={handleGenerateQR}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <QrCode2 sx={{ fontSize: 40 }} />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              Nhấn vào đây để thanh toán với vnpay
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate(RoutePaths.BOOK_FIELD)}
                      sx={{
                        borderColor: 'rgba(0, 102, 204, 0.5)',
                        color: '#0066CC',
                        '&:hover': {
                          borderColor: '#0066CC',
                          bgcolor: 'rgba(0, 102, 204, 0.05)',
                        },
                      }}
                    >
                      Back
                    </Button>
                  </Box>
                </>
              )}
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default VNPayPaymentPage;
