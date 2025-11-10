import { apiClient } from './client';
import { ApiResponse, User } from '@/types';

export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post<ApiResponse<{ token: string; user: User }>>(
      '/auth/admin/login',
      { email, password }
    );
    return response.data.data!;
  },

  register: async (data: { email: string; password: string; name: string }) => {
    const response = await apiClient.post<ApiResponse<{ token: string; user: User }>>(
      '/auth/register',
      data
    );
    return response.data.data!;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },

  updateProfile: async (data: { name?: string; phone?: string; avatar?: string }): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/auth/me', data);
    return response.data.data!;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.put('/auth/change-password', { currentPassword, newPassword });
  }
};
