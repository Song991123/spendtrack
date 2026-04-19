/**
 * 역할: 프로젝트에서 사용하는 데이터 형태를 타입으로 정의합니다.
 * 위치: src\types\purchase.ts
 */
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
