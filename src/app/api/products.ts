import { apiClient } from './client';
import { ApiResponse, Product } from '@/types';

export const productsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    isActive?: boolean;
    sortBy?: string;
  }): Promise<{ products: Product[]; pagination: any }> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', { params });
    return {
      products: response.data.data!,
      pagination: response.data.pagination!
    };
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  updateStock: async (id: string, quantity: number, operation: 'add' | 'subtract'): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `/products/${id}/stock`,
      { quantity, operation }
    );
    return response.data.data!;
  }
};
