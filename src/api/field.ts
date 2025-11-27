import { FieldSize, FieldStatus, FieldType } from '@/constants';
import { apiClient } from '@/libs';
import { ResponseObject } from '@/types';

type FieldResponse = {
  id: string;
  name: string;
  type: FieldType;
  size: FieldSize;
  status: FieldStatus;
  pricePerHour: number;
  images?: string[];
};

export const fetchFields = async () => {
  const response = await apiClient.get<ResponseObject<FieldResponse[]>>('/fields');

  return response.data.payload;
};
