import { logout } from '@/api/auth';
import { RoutePaths } from '@/constants/routes';
import { CalendarMonth, Logout, Person, SportsSoccer } from '@mui/icons-material';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

export const CustomerNavBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate(RoutePaths.LOGIN);
  };

  const navItems = [
    { label: 'Sân bóng', path: '/', icon: <SportsSoccer /> },
    { label: 'Đặt sân', path: RoutePaths.MY_BOOKINGS, icon: <CalendarMonth /> },
    { label: 'Hồ sơ', path: RoutePaths.MY_PROFILE, icon: <Person /> },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              flexGrow: 0,
              mr: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SportsSoccer sx={{ fontSize: 32 }} />
            Mini Ball
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  px: 2,
                  borderRadius: 2,
                  bgcolor:
                    location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Button
            onClick={handleLogout}
            startIcon={<Logout />}
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)',
              textTransform: 'none',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Đăng xuất
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
