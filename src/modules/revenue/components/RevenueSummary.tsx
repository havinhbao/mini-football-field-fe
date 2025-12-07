import { AttachMoney } from '@mui/icons-material';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { FC } from 'react';

interface RevenueSummaryProps {
  totalRevenue: number;
  loading: boolean;
}

export const RevenueSummary: FC<RevenueSummaryProps> = ({ totalRevenue, loading }) => {
  return (
    <Card
      sx={{
        mb: 3,
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: 'white',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            p: 1.5,
            mr: 2,
            display: 'flex',
          }}
        >
          <AttachMoney sx={{ fontSize: 40 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
            Tổng doanh thu
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {loading ? 'Đang tải...' : `${totalRevenue.toLocaleString()} VND`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
