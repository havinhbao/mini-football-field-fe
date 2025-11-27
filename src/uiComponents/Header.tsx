import { AppContext, AppStyles } from '@/constants';
import { isAuthenticated } from '@/middlewares';
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
import { FC, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';

type HeaderProps = {
  onSidebarToggle?: () => void;
  component?: ReactNode;
};

const Header: FC<HeaderProps> = ({ onSidebarToggle, component }) => {
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
          height: 60,
          boxShadow: AppStyles.boxShadow,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: 60, px: 2, display: 'flex', gap: 1 }}>
          {onSidebarToggle && (
            <IconButton onClick={onSidebarToggle} edge="start" color="inherit">
              <MenuIcon fontSize="small" />
            </IconButton>
          )}

          <Button
            variant="text"
            disableRipple
            sx={{ textTransform: 'none', p: 0 }}
            onClick={() => navigate('/dashboard', { replace: true })}
          >
            <Typography variant="h6" fontWeight={700} color="#333">
              Mini Ball
            </Typography>
          </Button>

          {component ? <Box sx={{ flexGrow: 1 }}>{component}</Box> : <Box sx={{ flexGrow: 1 }} />}

          {/* Avatar */}
          {isAuthenticated() ? (
            <Avatar
              src="https://i.pravatar.cc/100"
              sx={{ width: 36, height: 36, cursor: 'pointer' }}
              onClick={handleAvatarClick}
            />
          ) : (
            <>
              <Button
                variant="contained"
                sx={{ textTransform: 'none' }}
                onClick={() => navigate('/login')}
              >
                {AppContext.login}
              </Button>
              <Button
                variant="outlined"
                sx={{ textTransform: 'none' }}
                onClick={() => navigate('/register')}
              >
                {AppContext.register}
              </Button>
            </>
          )}
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

export default Header;
