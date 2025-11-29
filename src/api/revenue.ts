
export type RevenuePeriod = 'week' | 'month' | 'year';

export type RevenueData = {
  date: string; // YYYY-MM-DD or YYYY-MM or YYYY
  amount: number;
};

export type RevenueStats = {
  totalRevenue: number;
  breakdown: RevenueData[];
};

// Mock data generator
const generateMockData = (period: RevenuePeriod, date: Date): RevenueStats => {
  const breakdown: RevenueData[] = [];
  let totalRevenue = 0;

  if (period === 'week') {
    // Generate daily data for the week
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const current = new Date(startOfWeek);
      current.setDate(startOfWeek.getDate() + i);
      const amount = Math.floor(Math.random() * 1000000) + 500000;
      totalRevenue += amount;
      breakdown.push({
        date: current.toISOString().split('T')[0],
        amount,
      });
    }
  } else if (period === 'month') {
    // Generate daily data for the month
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const current = new Date(year, month, i);
      const amount = Math.floor(Math.random() * 1000000) + 500000;
      totalRevenue += amount;
      breakdown.push({
        date: current.toISOString().split('T')[0],
        amount,
      });
    }
  } else if (period === 'year') {
    // Generate monthly data for the year
    const year = date.getFullYear();
    for (let i = 0; i < 12; i++) {
      const amount = Math.floor(Math.random() * 10000000) + 5000000;
      totalRevenue += amount;
      breakdown.push({
        date: `${year}-${String(i + 1).padStart(2, '0')}`,
        amount,
      });
    }
  }

  return { totalRevenue, breakdown };
};

export const getRevenueStats = async (
  period: RevenuePeriod,
  date: Date
): Promise<RevenueStats> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockData(period, date));
    }, 500);
  });
};
