import { createBooking, getWeeklySchedule } from '@/api/booking';
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
  IconButton,
} from '@mui/material';
import { addDays, format, isBefore, startOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { CustomerNavBar } from '../components/CustomerNavBar';
import BookingTimeFrame from '../components/BookingTimeFrame';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { TSelectionState } from '@/types';

const TIME_START = 6;
const SLOT_MINS = 30;

function slotLabel(idx: number): string {
  const totalMins = TIME_START * 60 + idx * SLOT_MINS;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const BookFieldPage: FC = () => {
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [nameFilter, setNameFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState<FieldSize | ''>('');
  const [statusFilter, setStatusFilter] = useState<FieldStatus | ''>('');

  const [fields, setFields] = useState<any[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState(searchParams.get('fieldId') || '');
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedDate, setSelectedDate] = useState<TSelectionState>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'vnpay'>('cash');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, string[]>>();
  const isPrevDisabled = useMemo(
    () => isBefore(addDays(new Date(currentDate), -7), today),
    [currentDate, today],
  );
  const isNextDisabled = useMemo(
    () => isBefore(maxDate, addDays(new Date(currentDate), 7)),
    [currentDate, maxDate],
  );

  useEffect(() => {
    fetchFields();
  }, [nameFilter, sizeFilter, statusFilter]);

  useEffect(() => {
    if (selectedFieldId && currentDate) {
      fetchSchedule();
    }
  }, [selectedFieldId, currentDate]);

  const handlePrev = () => {
    const prev = addDays(new Date(currentDate), -7);
    if (!isBefore(prev, today)) {
      setCurrentDate(format(prev, 'yyyy-MM-dd'));
    }
  };

  const handleNext = () => {
    const next = addDays(new Date(currentDate), 7);
    if (!isBefore(maxDate, next)) {
      setCurrentDate(format(next, 'yyyy-MM-dd'));
    }
  };

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
      const data = await getWeeklySchedule(selectedFieldId, currentDate);
      console.log(data);
      setWeeklySchedule(data);
      // const schedule = await getDailySchedule(selectedFieldId, selectedDate);
      //
      // const slots: string[] = [];
      // for (let hour = 6; hour <= 22; hour++) {
      //   const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      //   const endTimeStr = `${(hour + 1).toString().padStart(2, '0')}:00`;
      //
      //   const isBooked = schedule.some((booking: any) => {
      //     return (
      //       booking.startTime === timeStr ||
      //       (booking.startTime < timeStr && booking.endTime > timeStr)
      //     );
      //   });
      //
      //   if (!isBooked) {
      //     slots.push(`${timeStr} - ${endTimeStr}`);
      //   }
      // }
      // setTimeSlots(slots);
    } catch (error) {
      showToast('Failed to load schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFieldId || !selectedDate) {
      showToast('Please select all fields', 'error');
      return;
    }

    if (paymentMethod === 'vnpay') {
      const bookingData = {
        fieldId: selectedFieldId,
        date: selectedDate.dateKey,
        startTime: slotLabel(selectedDate.startSlot),
        endtime: slotLabel(selectedDate.endSlot + 1),
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
        date: selectedDate.dateKey,
        startTime: slotLabel(selectedDate.startSlot),
        endTime: slotLabel(selectedDate.endSlot + 1),
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

              {/* ---------------------- old logic ---------------------- */}
              {/* <TextField */}
              {/*   fullWidth */}
              {/*   type="date" */}
              {/*   label="Chọn ngày" */}
              {/*   value={selectedDate} */}
              {/*   onChange={(e) => setSelectedDate(e.target.value)} */}
              {/*   slotProps={{ */}
              {/*     inputLabel: { shrink: true }, */}
              {/*   }} */}
              {/*   inputProps={{ */}
              {/*     min: format(new Date(), 'yyyy-MM-dd'), */}
              {/*     max: format(addDays(new Date(), 30), 'yyyy-MM-dd'), */}
              {/*   }} */}
              {/*   sx={{ mb: 3 }} */}
              {/* /> */}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 3,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                }}
              >
                <IconButton onClick={handlePrev} disabled={isPrevDisabled} size="small">
                  <ChevronLeft />
                </IconButton>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 200,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontSize: 10,
                    }}
                  >
                    Lịch đặt sân
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {format(new Date(currentDate), 'dd MMM', { locale: vi })}
                    {' – '}
                    {format(addDays(new Date(currentDate), 6), 'dd MMM yyyy', { locale: vi })}
                  </Typography>
                </Box>

                <IconButton onClick={handleNext} disabled={isNextDisabled} size="small">
                  <ChevronRight />
                </IconButton>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                weeklySchedule && (
                  <>
                    {/* <FormControl fullWidth sx={{ mb: 3 }}> */}
                    {/*   <InputLabel>Chọn khung giờ</InputLabel> */}
                    {/*   <Select */}
                    {/*     value={selectedSlot} */}
                    {/*     onChange={(e) => setSelectedSlot(e.target.value)} */}
                    {/*     label="Chọn khung giờ" */}
                    {/*   > */}
                    {/*     {timeSlots.map((slot) => ( */}
                    {/*       <MenuItem key={slot} value={slot}> */}
                    {/*         {slot} */}
                    {/*       </MenuItem> */}
                    {/*     ))} */}
                    {/*   </Select> */}
                    {/* </FormControl> */}

                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <BookingTimeFrame
                        currentDate={currentDate}
                        weeklySchedule={weeklySchedule!}
                        selection={selectedDate}
                        setSelection={(value) => setSelectedDate(value)}
                      />
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

                    {selectedDate && selectedField && (
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
                          Tổng tiền:
                          {(
                            (selectedField.pricePerHour *
                              (selectedDate?.endSlot - selectedDate?.startSlot + 1)) /
                            2
                          )?.toLocaleString()}{' '}
                          VND
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                          {paymentMethod === 'cash'
                            ? 'Thanh toán sẽ được thực hiện tại sân'
                            : 'Bạn sẽ được chuyển hướng đến VNPay để thanh toán'}
                        </Typography>
                      </Box>
                    )}
                  </>
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
                  disabled={!selectedFieldId || !selectedDate || submitting}
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
