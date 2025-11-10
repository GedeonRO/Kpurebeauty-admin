import { apiClient } from './client';
import { ApiResponse, AnalyticsOverview, Order, Product } from '@/types';

export const analyticsApi = {
  getOverview: async (period: 'day' | 'week' | 'month' = 'month'): Promise<AnalyticsOverview> => {
    const response = await apiClient.get<ApiResponse<AnalyticsOverview>>(
      `/analytics/overview?period=${period}`
    );
    return response.data.data!;
  },

  getRevenueOverTime: async (period: 'day' | 'week' | 'month' = 'month') => {
    const response = await apiClient.get(`/analytics/revenue?period=${period}`);
    return response.data.data;
  },

  getPopularProducts: async (period: 'day' | 'week' | 'month' = 'month', limit: number = 10) => {
    const response = await apiClient.get(
      `/analytics/popular-products?period=${period}&limit=${limit}`
    );
    return response.data.data;
  },

  getRecentOrders: async (limit: number = 10): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>(
      `/analytics/recent-orders?limit=${limit}`
    );
    return response.data.data!;
  },

  getLowStockProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/analytics/low-stock');
    return response.data.data!;
  }
};
