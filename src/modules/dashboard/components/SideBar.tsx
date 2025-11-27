import { AppContext, AppStyles, RoutePaths } from '@/constants';
import { buildPath } from '@/utils';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const drawerWidth = 240;
const miniWidth = 60;

type SideBarProps = {
  open: boolean;
};

const SideBar: FC<SideBarProps> = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState(location.pathname);

  useEffect(() => {
    setSelectedPath(location.pathname);
  }, [location.pathname]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        mt: '56px',
        height: 'calc(100vh - 56px)',
        zIndex: (theme) => theme.zIndex.appBar - 1,
        width: open ? drawerWidth : miniWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: 'width 0.25s ease',

        '& .MuiDrawer-paper': {
          mt: '56px',
          height: 'calc(100vh - 56px)',
          width: open ? drawerWidth : miniWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
          boxShadow: AppStyles.boxShadow,
          transition: 'width 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <List sx={{ mt: 1 }}>
        {[
          {
            title: AppContext.overview,
            icon: <DashboardIcon />,
            path: RoutePaths.DASHBOARD,
          },
          {
            title: AppContext.field_management,
            icon: <SportsSoccerIcon />,
            path: buildPath(RoutePaths.DASHBOARD, RoutePaths.DASHBOARD_SUBPATHS.FIELDS),
          },
          {
            title: AppContext.bookings,
            icon: <EventIcon />,
            path: buildPath(RoutePaths.DASHBOARD, RoutePaths.DASHBOARD_SUBPATHS.BOOKINGS),
          },
          {
            title: AppContext.customers,
            icon: <PeopleIcon />,
            path: buildPath(RoutePaths.DASHBOARD, RoutePaths.DASHBOARD_SUBPATHS.CUSTOMERS),
          },
          {
            title: AppContext.revenue,
            icon: <MonetizationOnIcon />,
            path: buildPath(RoutePaths.DASHBOARD, RoutePaths.DASHBOARD_SUBPATHS.REVENUE),
          },
          {
            title: AppContext.settings,
            icon: <SettingsIcon />,
            path: buildPath(RoutePaths.DASHBOARD, RoutePaths.DASHBOARD_SUBPATHS.SETTINGS),
          },
        ].map((item) => {
          const isActive = selectedPath === item.path;

          return (
            <ListItem key={item.title} disablePadding>
              <Tooltip title={open ? '' : item.title} placement="right">
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    position: 'relative',
                    py: 1.5,
                    px: 2,
                    justifyContent: open ? 'flex-start' : 'center',
                    backgroundColor: isActive ? '#E0E7FF' : 'transparent', // blue-100
                    transition: 'all 0.25s',
                    '&:hover': {
                      backgroundColor: isActive ? '#E0E7FF' : '#f5f5f5',
                    },
                  }}
                >
                  {isActive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        bgcolor: '#2563EB', // blue-600
                        borderRadius: '0 4px 4px 0',
                      }}
                    />
                  )}

                  <ListItemIcon
                    sx={{
                      color: isActive ? '#2563EB' : '#555',
                      minWidth: 0,
                      mr: open ? 2 : 0,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary={item.title}
                      slotProps={{
                        primary: {
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? '#1E3A8A' : '#111',
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default SideBar;
