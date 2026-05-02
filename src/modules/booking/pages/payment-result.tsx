import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import axios from 'axios';
import { Box, Button, CircularProgress, Divider, Paper, Stack, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { CustomerNavBar } from '@/modules/customer/components';
import { RoutePaths } from '@/constants';

interface BookingDetail {
  field?: { name: string };
  fieldId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  paymentMethod?: string;
  totalPrice?: number;
}

const METHOD_MAP: Record<string, string> = {
  cash: 'Tiền mặt',
  banking: 'Chuyển khoản',
  momo: 'MoMo',
  vnpay: 'VNPay',
};

const fmtVND = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

export default function PaymentResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';
  const amountRaw = searchParams.get('amount');

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    axios
      .get<BookingDetail>(`/api/bookings/${orderId}`)
      .then((res) => setBooking(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderId]);

  const totalDisplay = booking?.totalPrice
    ? fmtVND(booking.totalPrice)
    : amountRaw
      ? fmtVND(Number(amountRaw))
      : '—';

  const rows = [
    { label: 'Mã đơn', value: orderId },
    { label: 'Sân', value: booking?.field?.name ?? booking?.fieldId ?? '—' },
    { label: 'Ngày', value: booking?.date ? fmtDate(booking.date) : '—' },
    {
      label: 'Khung giờ',
      value:
        booking?.startTime && booking?.endTime ? `${booking.startTime} – ${booking.endTime}` : '—',
    },
    {
      label: 'Hình thức',
      value: METHOD_MAP[booking?.paymentMethod ?? ''] ?? booking?.paymentMethod ?? '—',
    },
  ];

  return (
    <>
      <CustomerNavBar />
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="grey.100"
        p={2}
      >
        <Stack spacing={1.5} width="100%" maxWidth={460}>
          <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box
              bgcolor="success.50"
              borderBottom="1px solid"
              borderColor="divider"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1.25}
              p={3}
            >
              <Box
                width={60}
                height={60}
                borderRadius="50%"
                bgcolor="background.paper"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 32 }} />
              </Box>
              <Box textAlign="center">
                <Typography fontWeight={500} fontSize={17} color="success.main">
                  Thanh toán thành công
                </Typography>
                <Typography fontSize={13} color="success.main" sx={{ opacity: 0.8 }}>
                  Đơn đặt sân của bạn đã được xác nhận
                </Typography>
              </Box>
            </Box>

            <Box p={2.5}>
              <Typography
                fontSize={11}
                fontWeight={500}
                color="text.secondary"
                letterSpacing="0.06em"
                sx={{ textTransform: 'uppercase', mb: 1.5 }}
              >
                Chi tiết đơn hàng
              </Typography>

              {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" gap={1} py={3}>
                  <CircularProgress size={16} />
                  <Typography fontSize={13} color="text.secondary">
                    Đang tải thông tin...
                  </Typography>
                </Box>
              )}

              {error && (
                <Box textAlign="center" py={3}>
                  <Typography fontSize={13} color="error.main">
                    Không thể tải chi tiết đơn hàng
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    Mã đơn: {orderId}
                  </Typography>
                </Box>
              )}

              {!loading && !error && (
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <Divider />
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    px={1.75}
                    py={1.5}
                    bgcolor="grey.50"
                  >
                    <Typography fontSize={13} fontWeight={500}>
                      Tổng tiền
                    </Typography>
                    <Typography fontSize={16} fontWeight={500} color="success.main">
                      {totalDisplay}
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Box>

            <Stack spacing={1} px={2.5} pb={2.5}>
              <Button
                fullWidth
                variant="contained"
                disableElevation
                onClick={() => navigate(RoutePaths.MY_BOOKINGS)}
              >
                Xem sân đã đặt
              </Button>
              <Button fullWidth variant="outlined" color="inherit" onClick={() => navigate('/')}>
                Về trang chủ
              </Button>
            </Stack>
          </Paper>

          <Typography textAlign="center" fontSize={12} color="text.secondary">
            Gặp vấn đề?{' '}
            <a href="mailto:support@miniball.vn" style={{ color: 'inherit' }}>
              Liên hệ hỗ trợ
            </a>
          </Typography>
        </Stack>
      </Box>
    </>
  );
}
