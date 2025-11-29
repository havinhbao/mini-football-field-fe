import { UserRole } from '@/constants';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}
