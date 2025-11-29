import { getBookingStats } from '@/api/booking';
import {
  AttachMoney,
  EventAvailable,
  GroupAdd,
  SportsSoccer,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { StatsCard } from '../components/StatsCard';

interface DashboardStats {
  activeFields: number;
  todayBookings: number;
  todayRevenue: number;
  newCustomers: number;
}

const OverviewPage: FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeFields: 0,
    todayBookings: 0,
    todayRevenue: 0,
    newCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getBookingStats({});
        // Map API response to dashboard stats
        setStats({
          activeFields: 12, // Mocked
          todayBookings: data.total || 0,
          todayRevenue: data.totalRevenue || 0,
          newCustomers: 5, // Mocked
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4,
          }}
        >
          Dashboard Overview
        </Typography>

        <Grid container spacing={3}>
          {/* Active Fields */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Active Fields"
              value={stats.activeFields}
              icon={<SportsSoccer />}
              color="#4CAF50"
            />
          </Grid>

          {/* Today's Bookings */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Bookings"
              value={stats.todayBookings}
              icon={<EventAvailable />}
              color="#2196F3"
              trend={{ value: 12, label: 'vs yesterday' }}
            />
          </Grid>

          {/* Today's Revenue */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Revenue"
              value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.todayRevenue)}
              icon={<AttachMoney />}
              color="#FF9800"
              trend={{ value: 8, label: 'vs yesterday' }}
            />
          </Grid>

          {/* New Customers */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="New Customers"
              value={stats.newCustomers}
              icon={<GroupAdd />}
              color="#9C27B0"
              trend={{ value: -2, label: 'vs yesterday' }}
            />
          </Grid>

          {/* Charts Section - Placeholder for future implementation */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 3, height: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Revenue Analytics
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    bgcolor: '#f8fafc',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Chart Visualization Coming Soon
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity - Placeholder */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, height: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Recent Activity
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: 'primary.light',
                          opacity: 0.2,
                        }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          New booking confirmed
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          2 minutes ago
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OverviewPage;
