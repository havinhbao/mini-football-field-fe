import { apiClient } from '@/libs';
import { ResponseObject } from '@/types';
import {
  BookingDto,
  BookingFilterDto,
  BookingStatsDto,
  ConfirmBookingDto,
  CreateBookingDto,
  ExtraServiceDto,
  PaginatedBookingResultDto,
  PayBookingDto,
  UpdateBookingDto,
} from '@/types/api';

export type { ExtraServiceDto, CreateBookingDto, UpdateBookingDto, PayBookingDto, ConfirmBookingDto, BookingFilterDto, BookingStatsDto, PaginatedBookingResultDto, BookingDto };

export const createBooking = async (payload: CreateBookingDto) => {
  const response = await apiClient.post<ResponseObject<BookingDto>>('/bookings', payload);
  return response.data.payload;
};

export const createBookingByAdmin = async (payload: CreateBookingDto) => {
  const response = await apiClient.post<ResponseObject<BookingDto>>('/bookings/admin', payload);
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
  const response = await apiClient.get<ResponseObject<BookingDto[]>>('/bookings/schedule/daily', {
    params: { fieldId, date },
  });
  return response.data.payload;
};

export const getBookingStats = async (params: BookingFilterDto) => {
  const response = await apiClient.get<ResponseObject<BookingStatsDto>>(
    '/bookings/stats/overview',
    {
      params,
    },
  );
  return response.data.payload;
};

export const getBookingById = async (id: string) => {
  const response = await apiClient.get<ResponseObject<BookingDto>>(`/bookings/${id}`);
  return response.data.payload;
};

export const updateBooking = async (id: string, payload: UpdateBookingDto) => {
  const response = await apiClient.patch<ResponseObject<BookingDto>>(`/bookings/${id}`, payload);
  return response.data.payload;
};

export const confirmBooking = async (id: string, payload?: ConfirmBookingDto) => {
  const response = await apiClient.put<ResponseObject<BookingDto>>(`/bookings/${id}/confirm`, payload);
  return response.data.payload;
};

export const payBooking = async (id: string, payload: PayBookingDto) => {
  const response = await apiClient.put<ResponseObject<BookingDto>>(`/bookings/${id}/pay`, payload);
  return response.data.payload;
};

export const cancelBooking = async (id: string, reason: string, refund: boolean) => {
  const response = await apiClient.put<ResponseObject<BookingDto>>(`/bookings/${id}/cancel`, {
    reason,
    refund,
  });
  return response.data.payload;
};

export const deleteBooking = async (id: string) => {
  const response = await apiClient.delete<ResponseObject<void>>(`/bookings/${id}`);
  return response.data.payload;
};
