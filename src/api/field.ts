import { FieldSize, FieldStatus, FieldType } from '@/constants';
import { apiClient } from '@/libs';
import { ResponseObject } from '@/types';

export type Field = {
  id: string;
  name: string;
  type: FieldType;
  size: FieldSize;
  status: FieldStatus;
  pricePerHour: number;
  images?: string[];
};

export const fetchFields = async () => {
  const response = await apiClient.get<ResponseObject<Field[]>>('/fields');

  return response.data.payload;
};
