import { apiClient } from './client';
import { ApiResponse, Routine } from '@/types';

export const routinesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<Routine[]> => {
    const response = await apiClient.get<ApiResponse<Routine[]>>('/routines', { params });
    return response.data.data!;
  },

  getById: async (id: string): Promise<Routine> => {
    const response = await apiClient.get<ApiResponse<Routine>>(`/routines/${id}`);
    return response.data.data!;
  },

  create: async (data: Partial<Routine>): Promise<Routine> => {
    const response = await apiClient.post<ApiResponse<Routine>>('/routines', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<Routine>): Promise<Routine> => {
    const response = await apiClient.put<ApiResponse<Routine>>(`/routines/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/routines/${id}`);
  }
};
