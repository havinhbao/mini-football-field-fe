import { eventBus } from '@/libs';

const useToast = () => {
  const showToast = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration?: number,
  ) => {
    eventBus.emit('showToast', { message, toastType: severity, duration });
  };

  return { showToast };
};

export default useToast;
