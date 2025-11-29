import { UserRole } from '@/constants';
import { apiClient } from '@/libs';
import { ResponseObject } from '@/types';

export type UserDto = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserDto = Partial<Omit<UserDto, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: string;
};

export const userApi = {
  updateUser: async (payload: UpdateUserDto) => {
    const response = await apiClient.patch<ResponseObject<UserDto>>('/users/update', payload);
    return response.data.payload;
  },

  getAllUsers: async () => {
    const response = await apiClient.get<ResponseObject<UserDto[]>>('/users');
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
