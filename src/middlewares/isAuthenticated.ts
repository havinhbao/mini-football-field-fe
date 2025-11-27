import { StorageKey } from '@/constants';
import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem(StorageKey.ACCESS_TOKEN);
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);

    // Nếu không có exp → token không hợp lệ
    if (!decoded.exp) return false;

    // exp là seconds → chuyển thành milliseconds
    const isExpired = decoded.exp * 1000 < Date.now();

    return !isExpired;
  } catch (e) {
    // Token không đúng format
    return false;
  }
};
