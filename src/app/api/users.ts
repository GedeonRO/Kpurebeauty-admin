import { apiClient } from './client';
import { ApiResponse, User } from '@/types';

export const usersApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'customer' | 'admin';
    isActive?: boolean;
    sortBy?: string;
  }): Promise<{ users: User[]; pagination: any }> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users', { params });
    return {
      users: response.data.data!,
      pagination: response.data.pagination!
    };
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data!;
  },

  getStats: async (id: string) => {
    const response = await apiClient.get(`/users/${id}/stats`);
    return response.data.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data!;
  },

  toggleStatus: async (id: string): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}/toggle-status`);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  }
};
