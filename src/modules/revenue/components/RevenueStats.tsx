import { getRevenueStats, RevenueData, RevenuePeriod } from '@/api/revenue';
import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { RevenueFilter } from './RevenueFilter';
import { RevenueSummary } from './RevenueSummary';
import { RevenueTable } from './RevenueTable';

export const RevenueStats: FC = () => {
  const [period, setPeriod] = useState<RevenuePeriod>('week');
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [breakdown, setBreakdown] = useState<RevenueData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getRevenueStats(period, date);
        setTotalRevenue(data.totalRevenue);
        setBreakdown(data.breakdown);
      } catch (error) {
        console.error('Failed to fetch revenue stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, date]);

  return (
    <Box>
      <RevenueFilter
        period={period}
        date={date}
        onPeriodChange={setPeriod}
        onDateChange={setDate}
      />

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 33.33%' } }}>
          <RevenueSummary totalRevenue={totalRevenue} loading={loading} />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 auto' } }}>
          <RevenueTable data={breakdown} loading={loading} />
        </Box>
      </Box>
    </Box>
  );
};
