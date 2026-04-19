/**
 * 역할: 해당 페이지에서 사용하는 목업 데이터와 화면 표시용 가공 함수를 모아둔 파일입니다.
 * 위치: src\pages\OcrEdit\data.ts
 */
export type Platform = "coupang" | "naver" | "musinsa";
export type Status = "purchase" | "sub" | "cancel" | "refund";

export interface OcrProduct {
  id: string;
  name: string;
  price: number;
  link?: string;
}

export interface OcrImageItem {
  id: string;
  fileName: string;
  thumbUrl: string;
  status: "analyzed" | "pending";
  platform: Platform;
  orderDate: string;
  productCount: number;
  totalAmount: number;
  statusTag: Status;
  products: OcrProduct[];
}

export interface OcrEditMockData {
  images: OcrImageItem[];
}

export const ocrEditMockData: OcrEditMockData = {
  images: [
    {
      id: "img1",
      fileName: "이미지 1",
      thumbUrl: "",
      status: "analyzed",
      platform: "coupang",
      orderDate: "2025.04.14",
      productCount: 2,
      totalAmount: 258000,
      statusTag: "purchase",
      products: [
        { id: "p1", name: "에어포스 1 로우 화이트 270", price: 129000, link: "" },
        { id: "p2", name: "에어맥스 90 블랙 265", price: 129000, link: "" },
      ],
    },
    {
      id: "img2",
      fileName: "이미지 2",
      thumbUrl: "",
      status: "pending",
      platform: "naver",
      orderDate: "2025.04.12",
      productCount: 1,
      totalAmount: 89000,
      statusTag: "purchase",
      products: [{ id: "p3", name: "캔버스 백 화이트", price: 89000 }],
    },
  ],
};

