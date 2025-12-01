import { FieldSize, FieldStatus, FieldType } from '@/constants';
import { apiClient } from '@/libs';
import { ResponseObject } from '@/types';

export type CreateFieldDto = {
  name: string;
  size: FieldSize;
  type: FieldType;
  pricePerHour: number;
  images?: string[];
};

export type UpdateFieldPayload = Partial<CreateFieldDto>;

export type Field = {
  id: string;
  name: string;
  type: FieldType;
  size: FieldSize;
  status: FieldStatus;
  pricePerHour: number;
  images?: string[];
  pricingRules?: Array<{
    start: string;
    end: string;
    price: number;
  }>;
  description?: string;
  hasCurrentBooking?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type FieldFilters = {
  currentTime?: string;
  size?: FieldSize;
  status?: FieldStatus;
  name?: string;
};

export const fetchFields = async (filters?: FieldFilters) => {
  const response = await apiClient.get<ResponseObject<Field[]>>('/fields', {
    params: filters,
  });

  return response.data.payload;
};

export const createField = async (payload: CreateFieldDto) => {
  const response = await apiClient.post<ResponseObject<Field>>('/fields', payload);
  return response.data.payload;
};

export const updateField = async (id: string, payload: UpdateFieldPayload) => {
  const response = await apiClient.patch<ResponseObject<void>>(`/fields/${id}`, payload);
  return response.data.payload;
};

export const getFieldById = async (id: string) => {
  const response = await apiClient.get<ResponseObject<Field | null>>(`/fields/${id}`);
  return response.data.payload;
};

export const deleteField = async (id: string) => {
  const response = await apiClient.delete<ResponseObject<void>>(`/fields/${id}`);
  return response.data.payload;
};
