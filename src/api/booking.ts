import { apiClient } from '@/libs';
import { ResponseObject } from '@/types';
import { Field } from './field';

export interface ExtraServiceDto {
  name: string;
  quantity: number;
  price: number;
}

export interface CreateBookingDto {
  fieldId: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  note?: string;
  extraServices?: ExtraServiceDto[];
  userId?: string;
}

export interface UpdateBookingDto {
  fieldId?: string;
  date?: Date | string;
  startTime?: string;
  endTime?: string;
  note?: string;
  status?: 'pending' | 'confirmed' | 'paid' | 'canceled';
  extraServices?: ExtraServiceDto[];
}

export interface PayBookingDto {
  paymentMethod: 'cash' | 'banking' | 'momo';
  depositAmount?: number;
}

export interface BookingFilterDto {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  fieldId?: string;
  userId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface BookingStatsDto {
  total: number;
  pending: number;
  confirmed: number;
  paid: number;
  canceled: number;
  totalRevenue: number;
}

export interface PaginatedBookingResultDto {
  data: {
    id: string;
    fieldId?: string;
    userId?: string;
    date: Date;
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    depositAmount: number;
    note?: string;
    cancelReason?: string;
    extraServices?: ExtraServiceDto[];
    field?: Partial<Field>;
    user?: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber: string;
    };
    createdBy?: unknown;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const createBooking = async (payload: CreateBookingDto) => {
  const response = await apiClient.post<ResponseObject<any>>('/bookings', payload);
  return response.data.payload;
};

export const createBookingByAdmin = async (payload: CreateBookingDto) => {
  const response = await apiClient.post<ResponseObject<any>>('/bookings/admin', payload);
  return response.data.payload;
};

export const getBookings = async (params: BookingFilterDto) => {
  const response = await apiClient.get<ResponseObject<PaginatedBookingResultDto>>('/bookings', {
    params,
  });
  return response.data.payload;
};

export const getMyBookings = async (params: BookingFilterDto) => {
  const response = await apiClient.get<ResponseObject<PaginatedBookingResultDto>>(
    '/bookings/my-bookings',
    {
      params,
    },
  );
  return response.data.payload;
};

export const getDailySchedule = async (fieldId: string, date: string) => {
  const response = await apiClient.get<ResponseObject<any[]>>('/bookings/schedule/daily', {
    params: { fieldId, date },
  });
  return response.data.payload;
};

export const getBookingStats = async (params: any) => {
  const response = await apiClient.get<ResponseObject<BookingStatsDto>>(
    '/bookings/stats/overview',
    {
      params,
    },
  );
  return response.data.payload;
};

export const getBookingById = async (id: string) => {
  const response = await apiClient.get<ResponseObject<any>>(`/bookings/${id}`);
  return response.data.payload;
};

export const updateBooking = async (id: string, payload: UpdateBookingDto) => {
  const response = await apiClient.patch<ResponseObject<any>>(`/bookings/${id}`, payload);
  return response.data.payload;
};

export const confirmBooking = async (id: string) => {
  const response = await apiClient.put<ResponseObject<any>>(`/bookings/${id}/confirm`);
  return response.data.payload;
};

export const payBooking = async (id: string, payload: PayBookingDto) => {
  const response = await apiClient.put<ResponseObject<any>>(`/bookings/${id}/pay`, payload);
  return response.data.payload;
};

export const cancelBooking = async (id: string, reason: string, refund: boolean) => {
  const response = await apiClient.put<ResponseObject<any>>(`/bookings/${id}/cancel`, {
    reason,
    refund,
  });
  return response.data.payload;
};

export const deleteBooking = async (id: string) => {
  const response = await apiClient.delete<ResponseObject<any>>(`/bookings/${id}`);
  return response.data.payload;
};
