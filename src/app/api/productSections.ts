import { apiClient } from './client';

export interface ProductSection {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  type: 'manual' | 'automatic';
  products?: string[];
  criteria?: {
    isFeatured?: boolean;
    isNew?: boolean;
    categoryId?: string;
    subCategoryId?: string;
    tags?: string[];
    minRating?: number;
    sortBy?: 'createdAt' | 'rating' | 'ordersCount' | 'price' | '-price';
  };
  limit: number;
  displayLocation: string[];
  order: number;
  isActive: boolean;
  style?: {
    layout?: 'grid' | 'carousel' | 'list';
    columns?: number;
    showPrice?: boolean;
    showRating?: boolean;
    showQuickView?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductSectionDTO {
  title: string;
  slug: string;
  description?: string;
  type: 'manual' | 'automatic';
  products?: string[];
  criteria?: {
    isFeatured?: boolean;
    isNew?: boolean;
    categoryId?: string;
    subCategoryId?: string;
    tags?: string[];
    minRating?: number;
    sortBy?: 'createdAt' | 'rating' | 'ordersCount' | 'price' | '-price';
  };
  limit: number;
  displayLocation: string[];
  order?: number;
  isActive?: boolean;
  style?: {
    layout?: 'grid' | 'carousel' | 'list';
    columns?: number;
    showPrice?: boolean;
    showRating?: boolean;
    showQuickView?: boolean;
  };
}

export const productSectionAPI = {
  // Get all product sections
  getAll: async (): Promise<ProductSection[]> => {
    const response = await apiClient.get('/product-sections');
    return response.data.data;
  },

  // Get product section by ID
  getById: async (id: string): Promise<ProductSection> => {
    const response = await apiClient.get(`/product-sections/${id}`);
    return response.data.data;
  },

  // Get product sections by location
  getByLocation: async (location: string): Promise<ProductSection[]> => {
    const response = await apiClient.get(`/product-sections/location/${location}`);
    return response.data.data;
  },

  // Create product section
  create: async (data: CreateProductSectionDTO): Promise<ProductSection> => {
    const response = await apiClient.post('/product-sections', data);
    return response.data.data;
  },

  // Update product section
  update: async (id: string, data: Partial<CreateProductSectionDTO>): Promise<ProductSection> => {
    const response = await apiClient.put(`/product-sections/${id}`, data);
    return response.data.data;
  },

  // Toggle active status
  toggleStatus: async (id: string): Promise<ProductSection> => {
    const response = await apiClient.patch(`/product-sections/${id}/toggle`);
    return response.data.data;
  },

  // Delete product section
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/product-sections/${id}`);
  },

  // Get products for a section
  getProducts: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/product-sections/${id}/products`);
    return response.data.data;
  },
};
