import { apiClient } from './client';
import { ApiResponse, Category } from '@/types';

export const categoriesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories', { params });
    return response.data.data!;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data!;
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    console.log('Creating category with data:', data);
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    console.log(`Updating category ${id} with data:`, data);
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  }
};
