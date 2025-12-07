import { RevenuePeriod } from '@/api/revenue';
import { capitalizeFirstLetter } from '@/utils';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, MenuItem, Select, Typography } from '@mui/material';
import {
  addDays,
  addMonths,
  addYears,
  format,
  startOfWeek,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { FC } from 'react';

interface RevenueFilterProps {
  period: RevenuePeriod;
  date: Date;
  onPeriodChange: (period: RevenuePeriod) => void;
  onDateChange: (date: Date) => void;
}

export const RevenueFilter: FC<RevenueFilterProps> = ({
  period,
  date,
  onPeriodChange,
  onDateChange,
}) => {
  const handlePrev = () => {
    if (period === 'week') {
      onDateChange(subDays(date, 7));
    } else if (period === 'month') {
      onDateChange(subMonths(date, 1));
    } else {
      onDateChange(subYears(date, 1));
    }
  };

  const handleNext = () => {
    if (period === 'week') {
      onDateChange(addDays(date, 7));
    } else if (period === 'month') {
      onDateChange(addMonths(date, 1));
    } else {
      onDateChange(addYears(date, 1));
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getDisplayText = () => {
    if (period === 'week') {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = addDays(start, 6);
      return `${format(start, 'dd/MM/yyyy', { locale: vi })} - ${format(end, 'dd/MM/yyyy', {
        locale: vi,
      })}`;
    } else if (period === 'month') {
      return capitalizeFirstLetter(format(date, 'MMMM yyyy', { locale: vi }));
    } else {
      return format(date, 'yyyy', { locale: vi });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        mb: 3,
      }}
    >
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as RevenuePeriod)}
          displayEmpty
        >
          <MenuItem value="week">Tuần</MenuItem>
          <MenuItem value="month">Tháng</MenuItem>
          <MenuItem value="year">Năm</MenuItem>
        </Select>
      </FormControl>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexGrow: 1,
          justifyContent: 'center',
        }}
      >
        <IconButton onClick={handlePrev}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center', fontWeight: 600 }}>
          {getDisplayText()}
        </Typography>
        <IconButton onClick={handleNext}>
          <ArrowForward />
        </IconButton>
      </Box>

      <Button variant="outlined" onClick={handleToday}>
        Hôm nay
      </Button>
    </Box>
  );
};
