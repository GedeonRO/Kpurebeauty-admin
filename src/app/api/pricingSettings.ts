import { apiClient } from "./client";

export interface PricingSettings {
  _id: string;
  exchangeRate: number;
  marginPercentage: number;
  marginType: "percentage" | "fixed";
  fixedMargin?: number;
  currency: "USD" | "EUR";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PriceCalculation {
  price: number;
  compareAtPrice?: number;
}

export const pricingSettingsApi = {
  // Get active pricing settings
  getSettings: async (): Promise<PricingSettings> => {
    const response = await apiClient.get("/pricing-settings");
    return response.data.data;
  },

  // Update pricing settings
  updateSettings: async (
    settings: Partial<PricingSettings>
  ): Promise<PricingSettings> => {
    const response = await apiClient.put("/pricing-settings", settings);
    return response.data.data;
  },

  // Calculate price preview
  calculatePrice: async (
    scrapedPrice: number,
    scrapedComparePrice?: number
  ): Promise<PriceCalculation> => {
    const response = await apiClient.post("/pricing-settings/calculate", {
      scrapedPrice,
      scrapedComparePrice,
    });
    return response.data.data;
  },
};
