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
    "주문 완료 화면을 캡처해 주세요. 상품명, 금액, 날짜가 보이도록 맞추면 좋아요.",
    "한 이미지에 여러 상품이 있어도 자동으로 분리해 보여줄 수 있어요.",
    "플랫폼을 먼저 선택하면 OCR 정확도를 조금 더 높일 수 있어요.",
  ],
  images: [
    { id: "u1", thumbUrl: "", fileName: "order-04-14.png", sizeLabel: "1.2 MB", status: "ready" },
    { id: "u2", thumbUrl: "", fileName: "order-04-12.png", sizeLabel: "980 KB", status: "ready" },
    { id: "u3", thumbUrl: "", fileName: "order-04-10.png", sizeLabel: "1.4 MB", status: "ready" },
  ],
};
