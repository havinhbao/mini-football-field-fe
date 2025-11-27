import { apiClient } from '@/libs';
import { ResponseObject } from '@/types';

export const authenticate = async (email: string, password: string): Promise<string> => {
  const response = await apiClient.post<ResponseObject<{ token: string }>>('/users/login', {
    email,
    password,
  });

  return response.data.payload.token;
};
