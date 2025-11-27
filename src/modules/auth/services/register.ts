import { createAdmin, createCustomer, createStaff } from '@/api';

export const customerRegister = async (email: string, password: string): Promise<void> => {
  await createCustomer(email, password);
};

export const adminRegister = async (email: string, password: string): Promise<void> => {
  await createAdmin(email, password);
};

export const staffRegister = async (email: string, password: string): Promise<void> => {
  await createStaff(email, password);
};
