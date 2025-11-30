import { UserRole } from '@/constants';
import { apiClient } from '@/libs';
import { ResponseObject, UpdateUserDto, UserDto } from '@/types';

export type { UserDto, UpdateUserDto };

export const userApi = {
  updateUser: async (payload: UpdateUserDto) => {
    const response = await apiClient.patch<ResponseObject<UserDto>>('/users/update', payload);
    return response.data.payload;
  },

  getAllUsers: async (filters?: { role?: UserRole; search?: string }) => {
    const response = await apiClient.get<ResponseObject<UserDto[]>>('/users', {
      params: filters,
    });
    return response.data.payload;
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get<ResponseObject<UserDto | null>>(`/users/${id}`);
    return response.data.payload;
  },

  getUserByEmail: async (email: string) => {
    const response = await apiClient.get<ResponseObject<UserDto | null>>('/users/by-email', {
      params: { email },
    });
    return response.data.payload;
  },
};
