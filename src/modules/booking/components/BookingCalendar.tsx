import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Card, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { FC, useState } from 'react';
import { Booking } from '../types';

interface BookingCalendarProps {
  bookings: Booking[];
  onDateClick: (date: Date) => void;
  onBookingClick: (booking: Booking) => void;
}

const statusColors = {
  pending: '#FFA726',
  confirmed: '#42A5F5',
  paid: '#66BB6A',
  canceled: '#EF5350',
};

export const BookingCalendar: FC<BookingCalendarProps> = ({
  bookings,
  onDateClick,
  onBookingClick,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getBookingsForDay = (day: Date) => {
    return bookings.filter((booking) => isSameDay(new Date(booking.date), day));
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <Card
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <IconButton onClick={handlePrevMonth} sx={{ color: 'white' }}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {format(currentMonth, 'MMMM yyyy', { locale: vi })}
        </Typography>
        <IconButton onClick={handleNextMonth} sx={{ color: 'white' }}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Weekday Headers */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 2 }}>
        {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day) => (
          <Box key={day} sx={{ textAlign: 'center', fontWeight: 600, opacity: 0.8 }}>
            {day}
          </Box>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {calendarDays.map((day) => {
          const dayBookings = getBookingsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <Box
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              sx={{
                minHeight: 100,
                p: 1,
                backgroundColor: isToday ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                cursor: 'pointer',
                opacity: isCurrentMonth ? 1 : 0.4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: isToday ? 700 : 500,
                  mb: 0.5,
                }}
              >
                {format(day, 'd')}
              </Typography>

              {/* Booking indicators */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {dayBookings.slice(0, 2).map((booking) => (
                  <Tooltip
                    key={booking.id}
                    title={`${booking.field?.name || 'Field'} - ${booking.startTime}`}
                  >
                    <Chip
                      label={booking.startTime}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick(booking);
                      }}
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        backgroundColor:
                          statusColors[booking.status as keyof typeof statusColors] || '#999',
                        color: 'white',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    />
                  </Tooltip>
                ))}
                {dayBookings.length > 2 && (
                  <Typography sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
                    +{dayBookings.length - 2} more
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
        {Object.entries(statusColors).map(([status, color]) => (
          <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: color }} />
            <Typography sx={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>
              {status}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
};
