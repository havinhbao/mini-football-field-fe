import { Field as FieldDto } from '@/api/field';

// ============= User Types =============

export interface CreateUserDto {
  email: string;
  password: string;
  role: string;
  phoneNumber?: string;
}

export interface UserDto {
  id: string;
  email: string;
  role: string;
  username: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserDto {
  id: string;
  email?: string;
  role?: string;
  username?: string;
  phoneNumber?: string;
}

// ============= Booking Types =============

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

export interface ConfirmBookingDto {
  paymentMethod?: 'cash' | 'banking' | 'momo';
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

export interface BookingDto {
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
  field?: Partial<FieldDto>;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  createdBy?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginatedBookingResultDto {
  data: BookingDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============= Revenue Types =============

export interface DailyRevenueDto {
  date: Date;
  revenue: number;
  count: number;
}

export interface WeeklyRevenueDto {
  week: number;
  revenue: number;
  count: number;
}

export interface YearlyRevenueDto {
  month: number;
  revenue: number;
  count: number;
}

export interface RevenueStatsDto {
  totalRevenue: number;
  totalTransactions: number;
  avgTransactionValue: number;
}
