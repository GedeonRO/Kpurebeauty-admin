import { apiClient } from './client';

export interface UploadResponse {
  success: boolean;
  url: string;
  publicId?: string;
}

export const uploadAPI = {
  // Upload image to Cloudinary
  uploadImage: async (formData: FormData): Promise<UploadResponse> => {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
