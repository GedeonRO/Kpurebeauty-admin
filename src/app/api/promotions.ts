import { apiClient } from './client';
import { ApiResponse, Promotion } from '@/types';

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil?: string;
  usageLimit?: number;
  perUserLimit?: number;
  usageCount: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  applicableRoutines?: string[];
  excludeProducts?: string[];
  excludeCategories?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const promotionsApi = {
  // Promotions
  getAll: async (params?: {
    active?: boolean;
    type?: string;
  }): Promise<Promotion[]> => {
    const response = await apiClient.get<ApiResponse<Promotion[]>>('/promotions/admin/promotions', { params });
    return response.data.data!;
  },

  create: async (data: Partial<Promotion>): Promise<Promotion> => {
    const response = await apiClient.post<ApiResponse<Promotion>>('/promotions/admin/promotions', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<Promotion>): Promise<Promotion> => {
    const response = await apiClient.put<ApiResponse<Promotion>>(`/promotions/admin/promotions/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/promotions/admin/promotions/${id}`);
  },

  toggleStatus: async (id: string): Promise<Promotion> => {
    const response = await apiClient.patch<ApiResponse<Promotion>>(`/promotions/admin/promotions/${id}/toggle-status`);
    return response.data.data!;
  },

  // Coupons
  getAllCoupons: async (params?: {
    active?: boolean;
    code?: string;
  }): Promise<Coupon[]> => {
    const response = await apiClient.get<ApiResponse<Coupon[]>>('/promotions/admin/coupons', { params });
    return response.data.data!;
  },

  createCoupon: async (data: Partial<Coupon>): Promise<Coupon> => {
    const response = await apiClient.post<ApiResponse<Coupon>>('/promotions/admin/coupons', data);
    return response.data.data!;
  },

  updateCoupon: async (id: string, data: Partial<Coupon>): Promise<Coupon> => {
    const response = await apiClient.put<ApiResponse<Coupon>>(`/promotions/admin/coupons/${id}`, data);
    return response.data.data!;
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await apiClient.delete(`/promotions/admin/coupons/${id}`);
  }
};
