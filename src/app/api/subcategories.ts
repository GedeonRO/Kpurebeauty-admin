import { apiClient } from './client';
import { ApiResponse, SubCategory } from '@/types';

export const subCategoriesApi = {
  getAll: async (params?: {
    categoryId?: string;
    isActive?: boolean;
  }): Promise<SubCategory[]> => {
    const response = await apiClient.get<ApiResponse<SubCategory[]>>('/subcategories', { params });
    return response.data.data!;
  },

  getByCategoryId: async (categoryId: string): Promise<SubCategory[]> => {
    const response = await apiClient.get<ApiResponse<SubCategory[]>>(`/categories/${categoryId}/subcategories`);
    return response.data.data!;
  },

  getById: async (id: string): Promise<SubCategory> => {
    const response = await apiClient.get<ApiResponse<SubCategory>>(`/subcategories/${id}`);
    return response.data.data!;
  },

  create: async (data: Partial<SubCategory>): Promise<SubCategory> => {
    const response = await apiClient.post<ApiResponse<SubCategory>>(`/categories/${data.categoryId}/subcategories`, data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<SubCategory>): Promise<SubCategory> => {
    const response = await apiClient.put<ApiResponse<SubCategory>>(`/subcategories/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/subcategories/${id}`);
  }
};
