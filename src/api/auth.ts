import { UserRole } from '@/constants';
import { apiClient } from '@/libs';
import { ResponseObject } from '@/types';

export const authenticate = async (email: string, password: string): Promise<string> => {
  const response = await apiClient.post<ResponseObject<{ token: string }>>('/auth/login', {
    email,
    password,
  });

  return response.data.payload.token;
};

export const createCustomer = async (email: string, password: string): Promise<void> => {
  await apiClient.post<ResponseObject<{ token: string }>>('/auth/register', {
    email,
    password,
    role: UserRole.CUSTOMER,
  });
};

export const createAdmin = async (email: string, password: string): Promise<void> => {
  await apiClient.post<ResponseObject<{ token: string }>>('/auth/register', {
    email,
    password,
    role: UserRole.ADMIN,
  });
};

export const createStaff = async (email: string, password: string): Promise<void> => {
  await apiClient.post<ResponseObject<{ token: string }>>('/auth/register', {
    email,
    password,
    role: UserRole.STAFF,
  });
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  await apiClient.post<ResponseObject<void>>('/auth/change-password', {
    oldPassword,
    newPassword,
  });
};

export const logout = async (): Promise<void> => {
  // If backend has logout endpoint
  // await apiClient.post('/auth/logout');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
