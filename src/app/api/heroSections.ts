import { apiClient } from './client';

export interface HeroSection {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  mobileImage?: string;
  backgroundColor?: string;
  textColor?: string;
  textPosition: 'left' | 'center' | 'right';
  overlay?: boolean;
  overlayOpacity?: number;
  order: number;
  isActive: boolean;
  displayLocation: string[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHeroSectionDTO {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  mobileImage?: string;
  backgroundColor?: string;
  textColor?: string;
  textPosition?: 'left' | 'center' | 'right';
  overlay?: boolean;
  overlayOpacity?: number;
  order?: number;
  isActive?: boolean;
  displayLocation: string[];
  startDate?: string;
  endDate?: string;
}

export const heroSectionAPI = {
  // Get all hero sections
  getAll: async (): Promise<HeroSection[]> => {
    const response = await apiClient.get('/hero-sections');
    return response.data.data;
  },

  // Get active hero sections
  getActive: async (location?: string): Promise<HeroSection[]> => {
    const params = location ? { location } : {};
    const response = await apiClient.get('/hero-sections/active', { params });
    return response.data.data;
  },

  // Get hero section by ID
  getById: async (id: string): Promise<HeroSection> => {
    const response = await apiClient.get(`/hero-sections/${id}`);
    return response.data.data;
  },

  // Get hero sections by location
  getByLocation: async (location: string): Promise<HeroSection[]> => {
    const response = await apiClient.get(`/hero-sections/location/${location}`);
    return response.data.data;
  },

  // Create hero section
  create: async (data: CreateHeroSectionDTO): Promise<HeroSection> => {
    const response = await apiClient.post('/hero-sections', data);
    return response.data.data;
  },

  // Update hero section
  update: async (id: string, data: Partial<CreateHeroSectionDTO>): Promise<HeroSection> => {
    const response = await apiClient.put(`/hero-sections/${id}`, data);
    return response.data.data;
  },

  // Toggle active status
  toggleStatus: async (id: string): Promise<HeroSection> => {
    const response = await apiClient.patch(`/hero-sections/${id}/toggle`);
    return response.data.data;
  },

  // Delete hero section
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/hero-sections/${id}`);
  },
};
