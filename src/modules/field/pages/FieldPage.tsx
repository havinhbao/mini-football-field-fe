import { isAuthenticated } from '@/middlewares';
import { CustomerNavBar } from '@/modules/customer/components/CustomerNavBar';
import { Header } from '@/uiComponents';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import SearchIcon from '@mui/icons-material/Search';
import SportsIcon from '@mui/icons-material/Sports';
import { alpha, Box, InputAdornment, Tab, Tabs, TextField, useTheme } from '@mui/material';
import { FC, useState } from 'react';
import { FieldGrid } from '../components';

const FieldPage: FC = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const authenticated = isAuthenticated();

  const handleChange = (_event: any, newValue: number) => {
    setTab(newValue);
  };

  const tabs = [
    { label: 'Tất cả sân', icon: <SportsIcon sx={{ fontSize: 18 }} /> },
    { label: 'Sân có sẵn', icon: <CheckCircleIcon sx={{ fontSize: 18 }} /> },
    { label: 'Sân đã đặt', icon: <EventBusyIcon sx={{ fontSize: 18 }} /> },
    { label: 'Sân bảo trì', icon: <BuildIcon sx={{ fontSize: 18 }} /> },
  ];

  return (
    <div
      style={{
        padding: 0,
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        flexDirection: 'column',
        backgroundColor: '#F3F4F6',
      }}
    >
      {authenticated ? (
        <CustomerNavBar />
      ) : (
        <Header
          component={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 3,
                p: 2,
                flexWrap: 'wrap',
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.02,
                )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
              }}
            >
              {/* SEARCH BAR */}
              <TextField
                placeholder="Tìm kiếm sân theo tên, vị trí..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: 360,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fff',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                      transform: 'translateY(-2px)',
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                      transform: 'translateY(-2px)',
                    },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: 22,
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* FILTER TABS */}
              <Tabs
                value={tab}
                onChange={handleChange}
                sx={{
                  bgcolor: alpha('#fff', 0.8),
                  borderRadius: 1,
                  p: 0.5,
                  backdropFilter: 'blur(10px)',
                  '.MuiTabs-indicator': {
                    display: 'none',
                  },
                  '.MuiTabs-flexContainer': {
                    gap: 0.5,
                  },
                  '.MuiTab-root': {
                    textTransform: 'none',
                    px: 2,
                    py: 1.2,
                    minHeight: 44,
                    borderRadius: 2.5,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.main,
                      transform: 'translateY(-1px)',
                    },
                    '&.Mui-selected': {
                      bgcolor: theme.palette.primary.main,
                      color: '#fff',
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                        transform: 'translateY(-1px)',
                      },
                    },
                  },
                }}
              >
                {tabs.map((tabItem, index) => (
                  <Tab
                    key={index}
                    icon={tabItem.icon}
                    iconPosition="start"
                    label={tabItem.label}
                    sx={{
                      '& .MuiTab-iconWrapper': {
                        mr: 1,
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          }
        />
      )}

      {/* CONTENT */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          py: 4,
          px: 8,
          flexGrow: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: alpha('#000', 0.05),
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: 4,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.5),
            },
          },
        }}
      >
        <FieldGrid />
      </Box>
    </div>
  );
};

export default FieldPage;
