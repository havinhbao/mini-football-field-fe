import { HeaderBar, SideBar } from '@/modules/dashboard/components';
import { Box } from '@mui/material';
import { FC, useState } from 'react';
import { Outlet } from 'react-router';

const DashboardPage: FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderBar onSidebarToggle={() => setSidebarOpen((prev) => !prev)} />

      <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <SideBar open={sidebarOpen} />

        {/* Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            bgcolor: '#F3F4F6',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
