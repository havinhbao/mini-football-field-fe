import { createBooking, getDailySchedule } from '@/api/booking';
import { FieldSize, FieldStatus } from '@/constants';
import { RoutePaths } from '@/constants/routes';
import { useToast } from '@/hooks';
import { getFields } from '@/modules/field/services';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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

  const [nameFilter, setNameFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState<FieldSize | ''>('');
  const [statusFilter, setStatusFilter] = useState<FieldStatus | ''>('');

  const [fields, setFields] = useState<any[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState(searchParams.get('fieldId') || '');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'vnpay'>('cash');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFields();
  }, [nameFilter, sizeFilter, statusFilter]);

  useEffect(() => {
    if (selectedFieldId && selectedDate) {
      fetchSchedule();
    }
  }, [selectedFieldId, selectedDate]);

  const fetchFields = async () => {
    try {
      const filters: any = {};
      if (nameFilter) filters.name = nameFilter;
      if (sizeFilter) filters.size = sizeFilter;
      if (statusFilter) filters.status = statusFilter;

      const response = await getFields(filters);
      setFields(response);
    } catch (error) {
      showToast('Failed to load fields', 'error');
    }
  };

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const schedule = await getDailySchedule(selectedFieldId, selectedDate);

      const slots: string[] = [];
      for (let hour = 6; hour <= 22; hour++) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        const endTimeStr = `${(hour + 1).toString().padStart(2, '0')}:00`;

        const isBooked = schedule.some((booking: any) => {
          return (
            booking.startTime === timeStr ||
            (booking.startTime < timeStr && booking.endTime > timeStr)
          );
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

    if (paymentMethod === 'vnpay') {
      const bookingData = {
        fieldId: selectedFieldId,
        date: selectedDate,
        startTime,
        endTime,
      };
      navigate(
        `${RoutePaths.VNPAY_PAYMENT}?data=${encodeURIComponent(JSON.stringify(bookingData))}`,
      );
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        fieldId: selectedFieldId,
        date: selectedDate,
        startTime,
        endTime,
      });
      showToast('Booking created successfully! Pending payment confirmation.', 'success');
      navigate(RoutePaths.MY_BOOKINGS);
    } catch (error) {
      showToast('Failed to create booking', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  return (
    <Box sx={{ bgcolor: '#f5f7fa', height: '100vh' }}>
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Đặt sân bóng
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Chọn ngày, giờ và phương thức thanh toán bạn muốn
          </Typography>

          <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              {/* Search Filters */}
              <Box sx={{ mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Bộ lọc tìm kiếm
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    label="Tên sân"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    placeholder="Tìm theo tên..."
                    sx={{ flex: '1 1 200px' }}
                  />
                  <FormControl size="small" sx={{ flex: '1 1 150px' }}>
                    <InputLabel>Kích thước</InputLabel>
                    <Select
                      value={sizeFilter}
                      onChange={(e) => setSizeFilter(e.target.value as FieldSize | '')}
                      label="Kích thước"
                    >
                      <MenuItem value="">Tất cả kích thước</MenuItem>
                      <MenuItem value={FieldSize.FIVE_SIDE}>Sân 5 (5v5)</MenuItem>
                      <MenuItem value={FieldSize.SEVEN_SIDE}>Sân 7 (7v7)</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ flex: '1 1 150px' }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as FieldStatus | '')}
                      label="Trạng thái"
                    >
                      <MenuItem value="">Tất cả trạng thái</MenuItem>
                      <MenuItem value={FieldStatus.AVAILABLE}>Có sẵn</MenuItem>
                      <MenuItem value={FieldStatus.MAINTENANCE}>Bảo trì</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                {(nameFilter || sizeFilter || statusFilter) && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {nameFilter && (
                      <Chip
                        size="small"
                        label={`Tên sân: ${nameFilter}`}
                        onDelete={() => setNameFilter('')}
                      />
                    )}
                    {sizeFilter && (
                      <Chip
                        size="small"
                        label={`Kích thước: ${sizeFilter}`}
                        onDelete={() => setSizeFilter('')}
                      />
                    )}
                    {statusFilter && (
                      <Chip
                        size="small"
                        label={`Trạng thái: ${statusFilter}`}
                        onDelete={() => setStatusFilter('')}
                      />
                    )}
                  </Box>
                )}
              </Box>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Chọn sân</InputLabel>
                <Select
                  value={selectedFieldId}
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                  label="Chọn sân"
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
                    Loại: {selectedField.type} | Kích thước: {selectedField.size}
                  </Typography>
                </Box>
              )}

              <TextField
                fullWidth
                type="date"
                label="Chọn ngày"
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
                    <InputLabel>Chọn khung giờ</InputLabel>
                    <Select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      label="Chọn khung giờ"
                    >
                      {timeSlots.map((slot) => (
                        <MenuItem key={slot} value={slot}>
                          {slot}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Phương thức thanh toán</InputLabel>
                    <Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'vnpay')}
                      label="Phương thức thanh toán"
                    >
                      <MenuItem value="cash">Tiền mặt (Cash)</MenuItem>
                      <MenuItem value="vnpay">VNPay</MenuItem>
                    </Select>
                  </FormControl>

                  {selectedSlot && selectedField && (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: paymentMethod === 'vnpay' ? 'info.light' : 'success.light',
                        color: paymentMethod === 'vnpay' ? 'info.dark' : 'success.dark',
                        borderRadius: 1,
                        mb: 3,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Tổng tiền: {selectedField.pricePerHour?.toLocaleString()} VND
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                        {paymentMethod === 'cash'
                          ? 'Thanh toán sẽ được thực hiện tại sân'
                          : 'Bạn sẽ được chuyển hướng đến VNPay để thanh toán'}
                      </Typography>
                    </Box>
                  )}
                </>
              ) : (
                selectedFieldId &&
                selectedDate && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 2 }}
                  >
                    Không có khung giờ trống cho ngày này. Vui lòng chọn ngày khác.
                  </Typography>
                )
              )}

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" fullWidth onClick={() => navigate('/')}>
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={!selectedFieldId || !selectedDate || !selectedSlot || submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                >
                  {submitting
                    ? 'Đang đặt...'
                    : paymentMethod === 'vnpay'
                    ? 'Tiến hành thanh toán'
                    : 'Xác nhận đặt sân'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default BookFieldPage;
