import type { Platform } from "./platform";
import type { Category } from "./product";

export interface Purchase {
  id: string;
  productName: string;
  platform: Platform;
  category: Category;
  amount: number;
  purchasedAt: string;
}

export type Transaction = Purchase;

export interface PurchaseFilter {
  platform?: Platform;
  category?: Category;
  keyword?: string;
}

export interface Subscription {
  id: string;
  serviceName: string;
  amount: number;
  billingDate: string;
  platform: Platform;
}

export interface CategorySummary {
  category: Category;
  amount: number;
  percent: number;
}

export interface MonthlySummary {
  month: string;
  amount: number;
}

export interface UploadedImage {
  id: string;
  fileName: string;
  previewUrl: string;
}