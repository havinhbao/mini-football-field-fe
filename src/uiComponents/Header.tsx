import { AppStyles } from '@/constants';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router';

type HeaderProps = {
  onSidebarToggle?: () => void;
  component?: ReactNode;
};

const Header: FC<HeaderProps> = ({ onSidebarToggle, component }) => {
  const navigate = useNavigate();

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
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
