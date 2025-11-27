import { authenticate } from '@/api';
import { StorageKey } from '@/constants';

export const login = async (email: string, password: string) => {
  const accessToken = await authenticate(email, password);

  localStorage.setItem(StorageKey.ACCESS_TOKEN, accessToken);
};
