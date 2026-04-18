export type TransactionType = "expense" | "income";

export type StatusTag =
  | "purchase"
  | "refund"
  | "cancel"
  | "return"
  | "recurring"
  | "subscription";

export type PlatformId = "coupang" | "naver" | "musinsa" | "other";

export type InputSource = "ocr" | "manual";

export interface Product {
  id: string;
  name: string;
  price: number;
  link?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
  platform: PlatformId;
  statusTag: StatusTag;
  source: InputSource;
  memo?: string;
  products?: Product[];
}
