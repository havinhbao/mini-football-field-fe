import { apiClient } from '@/libs';
import { ResponseObject } from '@/types';
import {
  DailyRevenueDto,
  RevenueStatsDto,
  WeeklyRevenueDto,
  YearlyRevenueDto,
} from '@/types/api';

export type RevenuePeriod = 'week' | 'month' | 'year';

export type RevenueData = {
  date: string; // YYYY-MM-DD or YYYY-MM or YYYY
  amount: number;
};

export type RevenueStats = {
  totalRevenue: number;
  breakdown: RevenueData[];
};

// Get daily revenue
export const getDailyRevenue = async (startDate: string, endDate: string) => {
  const response = await apiClient.get<ResponseObject<DailyRevenueDto[]>>('/revenues/daily', {
    params: { startDate, endDate },
  });
  return response.data.payload;
};

// Get weekly revenue
export const getWeeklyRevenue = async (year: number, month: number) => {
  const response = await apiClient.get<ResponseObject<WeeklyRevenueDto[]>>('/revenues/weekly', {
    params: { year, month },
  });
  return response.data.payload;
};

// Get yearly revenue
export const getYearlyRevenue = async (year: number) => {
  const response = await apiClient.get<ResponseObject<YearlyRevenueDto[]>>('/revenues/yearly', {
    params: { year },
  });
  return response.data.payload;
};

// Get revenue statistics
export const getRevenueStatsRaw = async (startDate?: string, endDate?: string) => {
  const response = await apiClient.get<ResponseObject<RevenueStatsDto>>('/revenues/stats', {
    params: { startDate, endDate },
  });
  return response.data.payload;
};

// Unified function for UI - maps period to appropriate API call
export const getRevenueStats = async (
  period: RevenuePeriod,
  date: Date
): Promise<RevenueStats> => {
  try {
    if (period === 'week') {
      // Get week's start and end dates
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startDate = startOfWeek.toISOString().split('T')[0];
      const endDate = endOfWeek.toISOString().split('T')[0];

      const data = await getDailyRevenue(startDate, endDate);
      
      const breakdown: RevenueData[] = data.map((item) => ({
        date: new Date(item.date).toISOString().split('T')[0],
        amount: item.revenue,
      }));

      const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

      return { totalRevenue, breakdown };
    } else if (period === 'month') {
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      const data = await getDailyRevenue(startDate, endDate);
      
      const breakdown: RevenueData[] = data.map((item) => ({
        date: new Date(item.date).toISOString().split('T')[0],
        amount: item.revenue,
      }));

      const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

      return { totalRevenue, breakdown };
    } else if (period === 'year') {
      const year = date.getFullYear();
      const data = await getYearlyRevenue(year);
      
      const breakdown: RevenueData[] = data.map((item) => ({
        date: `${year}-${String(item.month).padStart(2, '0')}`,
        amount: item.revenue,
      }));

      const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

      return { totalRevenue, breakdown };
    }

    return { totalRevenue: 0, breakdown: [] };
  } catch (error) {
    console.error('Failed to fetch revenue stats:', error);
    throw error;
  }
};
