import { StorageKey } from '@/constants';
import Axios from 'axios';

export const apiClient = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(StorageKey.ACCESS_TOKEN);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.error('Unauthorized access - redirecting to login');
      window.location.href = '/login';
    }

    if (error.response && error.response.status === 403) {
      // Handle forbidden access
      console.error('Forbidden access - you do not have permission to view this resource');
    }

    return Promise.reject(error);
  },
);
