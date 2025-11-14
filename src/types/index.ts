export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  favoriteProducts: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: string | Category;
  subCategoryId?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  mainImage: string;
  tags: string[];
  brand?: string;
  ingredients?: string[];
  howToUse?: string;
  benefits?: string[];
  skinType?: string[];
  weight?: number;
  volume?: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  likesCount: number; // ← AJOUTER CETTE LIGNE
  ordersCount: number; // ← AJOUTER CETTE LIGNE
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  categoryId: string | Category;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineProduct {
  productId: string | Product;
  order: number;
  note?: string;
}

export interface Routine {
  _id: string;
  name: string;
  slug: string;
  description: string;
  goal: string;
  duration?: string;
  products: RoutineProduct[];
  price: number;
  compareAtPrice?: number;
  image: string;
  images: string[];
  skinType?: string[];
  concerns?: string[];
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  userId: string | User;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  notes?: string;
  cancelReason?: string;
  statusHistory: StatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId?: string;
  routineId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
  type: 'product' | 'routine';
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface StatusHistory {
  status: string;
  date: string;
  note?: string;
}

export interface Review {
  _id: string;
  userId: string | User;
  type: 'product' | 'routine';
  productId?: string | Product;
  routineId?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  moderatorNote?: string;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  _id: string;
  title: string;
  description?: string;
  type: 'banner' | 'popup' | 'inline';
  image?: string;
  backgroundColor?: string;
  textColor?: string;
  ctaText?: string;
  ctaLink?: string;
  targetProducts?: string[];
  targetCategories?: string[];
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsOverview {
  period: 'day' | 'week' | 'month';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  orders: {
    total: number;
    growth: number;
    byStatus: Array<{ _id: string; count: number }>;
  };
  users: {
    total: number;
    new: number;
  };
  revenue: {
    total: number;
    growth: number;
    averageOrderValue: number;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationMeta;
}
