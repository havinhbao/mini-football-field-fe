import { Box, Card, CardContent, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export const StatsCard: FC<StatsCardProps> = ({ title, value, icon, color = 'primary.main', trend }) => {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {value}
            </Typography>
          </Box>
          {icon && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: `${color}15`, // 15 is roughly 8% opacity in hex
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: trend.value >= 0 ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {trend.value > 0 && '+'}
              {trend.value}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {trend.label}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
