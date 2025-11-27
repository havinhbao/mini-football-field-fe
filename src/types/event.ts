export type Event = {
  showToast: {
    message: string;
    toastType: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  };
};
