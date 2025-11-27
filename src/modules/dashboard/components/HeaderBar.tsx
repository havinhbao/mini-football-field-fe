import { AppStyles } from '@/constants';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Toolbar,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router';

type HeaderBarProps = {
  onSidebarToggle?: () => void;
};

const HeaderBar: FC<HeaderBarProps> = ({ onSidebarToggle }) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          bgcolor: '#ffffff',
          color: '#333',
          height: 56,
          boxShadow: AppStyles.boxShadow,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: 56, px: 2, display: 'flex', gap: 1 }}>
          <IconButton onClick={onSidebarToggle} edge="start" color="inherit">
            <MenuIcon fontSize="small" />
          </IconButton>

          <Button
            variant="text"
            disableRipple
            sx={{ textTransform: 'none', p: 0 }}
            onClick={() => navigate('/dashboard', { replace: true })}
          >
            <Typography variant="h6" fontWeight={700} color="#333">
              MFFMS
            </Typography>
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          {/* Avatar */}
          <Avatar
            src="https://i.pravatar.cc/100"
            sx={{ width: 36, height: 36, cursor: 'pointer' }}
            onClick={handleAvatarClick}
          />
        </Toolbar>
      </AppBar>

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: -5,
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              width: 180,
              boxShadow: AppStyles.boxShadow,
              p: 1,
            },
          },
        }}
      >
        <List disablePadding>
          <ListItemButton
            sx={{ borderRadius: 1 }}
            onClick={() => {
              handleClose();
              navigate('/profile');
            }}
          >
            <ListItemText primary="Profile" />
          </ListItemButton>

          <ListItemButton
            sx={{ borderRadius: 1, color: '#DC2626' }} // đỏ nhẹ cho logout
            onClick={() => {
              handleClose();
              localStorage.clear();
              navigate('/login', { replace: true });
            }}
          >
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Popover>
    </>
  );
};

export default HeaderBar;
