import { createAdmin, createCustomer } from '@/api';

export const customerRegister = async (email: string, password: string): Promise<void> => {
  await createCustomer(email, password);
};

export const adminRegister = async (email: string, password: string): Promise<void> => {
  await createAdmin(email, password);
};
