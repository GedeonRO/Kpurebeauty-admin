import { apiClient } from './client';
import { ApiResponse, Order } from '@/types';

export const ordersApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ orders: Order[]; pagination: any }> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders', { params });
    return {
      orders: response.data.data!,
      pagination: response.data.pagination!
    };
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data!;
  },

  updateStatus: async (
    id: string,
    status: Order['status'],
    note?: string
  ): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/status`,
      { status, note }
    );
    return response.data.data!;
  },

  updatePaymentStatus: async (
    id: string,
    paymentStatus: Order['paymentStatus'],
    transactionId?: string
  ): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/payment-status`,
      { paymentStatus, transactionId }
    );
    return response.data.data!;
  },

  addTrackingNumber: async (id: string, trackingNumber: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/tracking`,
      { trackingNumber }
    );
    return response.data.data!;
  },

  cancel: async (id: string, reason: string): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      `/orders/${id}/cancel`,
      { reason }
    );
    return response.data.data!;
  }
};
