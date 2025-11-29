import { StorageKey, UserRole } from '@/constants';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id?: string;
  sub?: string;
  role?: UserRole;
  exp?: number;
}

export const getUserRole = (): UserRole | null => {
  const token = localStorage.getItem(StorageKey.ACCESS_TOKEN);
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.role || null;
  } catch (e) {
    return null;
  }
};

export const isCustomer = (): boolean => {
  return getUserRole() === UserRole.CUSTOMER;
};

export const isAdmin = (): boolean => {
  return getUserRole() === UserRole.ADMIN;
};

export const isStaff = (): boolean => {
  return getUserRole() === UserRole.STAFF;
};

export const isAdminOrStaff = (): boolean => {
  const role = getUserRole();
  return role === UserRole.ADMIN || role === UserRole.STAFF;
};
