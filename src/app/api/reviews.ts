import { apiClient } from './client';
import { ApiResponse, Review } from '@/types';

export const reviewsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    rating?: number;
    search?: string;
    sortBy?: string;
  }): Promise<{ reviews: Review[]; pagination: any }> => {
    const response = await apiClient.get<ApiResponse<Review[]>>('/reviews/admin/all', { params });
    return {
      reviews: response.data.data!,
      pagination: response.data.pagination!
    };
  },

  getPending: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ reviews: Review[]; pagination: any }> => {
    const response = await apiClient.get<ApiResponse<Review[]>>('/reviews/admin/pending', { params });
    return {
      reviews: response.data.data!,
      pagination: response.data.pagination!
    };
  },

  approve: async (id: string, moderatorNote?: string): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(
      `/reviews/${id}/approve`,
      { moderatorNote }
    );
    return response.data.data!;
  },

  reject: async (id: string, moderatorNote?: string): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(
      `/reviews/${id}/reject`,
      { moderatorNote }
    );
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`);
  }
};
