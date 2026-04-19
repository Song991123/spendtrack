export interface UploadedImage {
  id: string;
  thumbUrl: string;
  fileName: string;
  sizeLabel: string;
  status: "ready" | "analyzing" | "done";
}

export interface OcrUploadMockData {
  guide: string[];
  images: UploadedImage[];
}

export const ocrUploadMockData: OcrUploadMockData = {
  guide: [
    "주문 완료 화면을 캡처해 주세요 (상품명, 금액, 날짜가 보이도록)",
    "한 장에 여러 상품이 포함되어도 자동 분리됩니다",
    "플랫폼을 먼저 선택하면 OCR 정확도가 높아집니다",
  ],
  images: [
    { id: "u1", thumbUrl: "", fileName: "order-04-14.png", sizeLabel: "1.2 MB", status: "ready" },
    { id: "u2", thumbUrl: "", fileName: "order-04-12.png", sizeLabel: "980 KB", status: "ready" },
    { id: "u3", thumbUrl: "", fileName: "order-04-10.png", sizeLabel: "1.4 MB", status: "ready" },
  ],
};
