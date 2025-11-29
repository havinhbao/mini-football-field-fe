import { Box, Container, Typography } from '@mui/material';
import { FC } from 'react';
import { RevenueStats } from '../components';

const RevenueManagementPage: FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Revenue Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Track your business performance and revenue statistics
          </Typography>
        </Box>

        <RevenueStats />
      </Container>
    </Box>
  );
};

export default RevenueManagementPage;
