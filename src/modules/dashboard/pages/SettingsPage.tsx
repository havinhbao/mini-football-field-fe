import { logout } from '@/api/auth';
import { StorageKey } from '@/constants';
import { RoutePaths } from '@/constants/routes';
import { ProfileSettings, SecuritySettings } from '@/modules/dashboard/components';
import { Logout } from '@mui/icons-material';
import { Box, Button, Container, Paper, Tab, Tabs, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const SettingsPage: FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem(StorageKey.ACCESS_TOKEN);
    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        if (decoded.id) {
          setUserId(decoded.id);
        } else if (decoded.sub) {
          setUserId(decoded.sub);
        }
      } catch (e) {
        console.error('Failed to decode token', e);
      }
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(RoutePaths.LOGIN);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Cài đặt tài khoản
            </Typography>
          </Box>
          <Button variant="outlined" color="error" startIcon={<Logout />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Box>

        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
          >
            <Tab label="Hồ sơ" />
            <Tab label="Bảo mật" />
          </Tabs>

          <Box sx={{ p: 4 }}>
            {activeTab === 0 && <ProfileSettings userId={userId} />}
            {activeTab === 1 && <SecuritySettings />}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SettingsPage;
