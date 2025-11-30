import { StorageKey, UserRole } from '@/constants';
import { apiClient } from '@/libs';
import { ResponseObject } from '@/types';
import { UserDto } from '@/types/api';

export const authenticate = async (email: string, password: string): Promise<string> => {
  const response = await apiClient.post<ResponseObject<{ token: string }>>('/auth/login', {
    email,
    password,
  });

  return response.data.payload.token;
};

export const createCustomer = async (email: string, password: string): Promise<UserDto> => {
  const response = await apiClient.post<ResponseObject<UserDto>>('/auth/register', {
    email,
    password,
    role: UserRole.CUSTOMER,
  });
  return response.data.payload;
};

export const createAdmin = async (email: string, password: string): Promise<UserDto> => {
  const response = await apiClient.post<ResponseObject<UserDto>>('/auth/register', {
    email,
    password,
    role: UserRole.ADMIN,
  });
  return response.data.payload;
};

export const createStaff = async (email: string, password: string): Promise<UserDto> => {
  const response = await apiClient.post<ResponseObject<UserDto>>('/auth/register', {
    email,
    password,
    role: UserRole.STAFF,
  });
  return response.data.payload;
};

export const logout = async (): Promise<void> => {
  // If backend has logout endpoint
  // await apiClient.post('/auth/logout');
  localStorage.removeItem(StorageKey.ACCESS_TOKEN);
};
