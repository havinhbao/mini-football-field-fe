import { eventBus } from '@/libs';
import CancelRounded from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Portal, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Slide, { SlideProps } from '@mui/material/Slide';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import React, { useEffect } from 'react';

const DefaultDuration = 3000;
const ToastContainerId = 'toast-portal-container';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircleRoundedIcon />;
    case 'error':
      return <CancelRounded />;
    case 'warning':
      return <WarningRoundedIcon />;
    default:
      return <InfoRoundedIcon />;
  }
};

const getBgColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'rgba(56, 142, 60, 0.10)';
    case 'error':
      return 'rgba(211, 47, 47, 0.10)';
    case 'warning':
      return 'rgba(237, 108, 2, 0.12)';
    default:
      return 'rgba(2, 136, 209, 0.10)';
  }
};

const getBorderColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'rgba(56, 142, 60, 0.4)';
    case 'error':
      return 'rgba(211, 47, 47, 0.4)';
    case 'warning':
      return 'rgba(237, 108, 2, 0.4)';
    default:
      return 'rgba(2, 136, 209, 0.4)';
  }
};

const getTextColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'rgb(46, 125, 50)';
    case 'error':
      return 'rgb(198, 40, 40)';
    case 'warning':
      return 'rgb(230, 81, 0)';
    default:
      return 'rgb(2, 119, 189)';
  }
};

const Toast: React.FC = () => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const portalContainer = document.getElementById(ToastContainerId) || document.body;

  useEffect(() => {
    if (!document.getElementById(ToastContainerId)) {
      const containerDiv = document.createElement('div');
      containerDiv.id = ToastContainerId;
      document.body.appendChild(containerDiv);

      return () => {
        document.body.removeChild(containerDiv);
      };
    }
  }, []);

  const showToast = (message: string, type: ToastType, duration: number = DefaultDuration) => {
    const newToast: ToastItem = {
      id: `toast-${Date.now()}`,
      message,
      type,
      duration,
    };

    setToasts((prev) => [newToast, ...prev]);
  };

  const handleClose = (id: string, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    eventBus.on('showToast', (data) => {
      const { message, toastType, duration } = data;
      showToast(message, toastType, duration);
    });

    return () => {
      eventBus.off('showToast');
    };
  }, []);

  return (
    <Portal container={portalContainer}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 2000,
          pointerEvents: 'none',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        {toasts.map((toast) => (
          <Snackbar
            key={toast.id}
            open={true}
            autoHideDuration={toast.duration}
            onClose={(_, reason) => handleClose(toast.id, reason)}
            slots={{ transition: SlideTransition }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
              position: 'relative',
              mb: 2,
              pointerEvents: 'auto',
            }}
          >
            <Alert
              onClose={() => handleClose(toast.id)}
              severity={toast.type}
              icon={getIcon(toast.type)}
              color={toast.type}
              variant="standard"
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.5,
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                backdropFilter: 'blur(12px)',
                backgroundColor: getBgColor(toast.type),
                color: getTextColor(toast.type),
                border: `1px solid ${getBorderColor(toast.type)}`,
                animation: 'fadeInSlide 0.2s ease-out',
                '@keyframes fadeInSlide': {
                  from: { opacity: 0, transform: 'translateY(-10px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Typography>{toast.message}</Typography>
            </Alert>
          </Snackbar>
        ))}
      </Box>
    </Portal>
  );
};

export default Toast;
