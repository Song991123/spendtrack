export const PLATFORM_LABELS = {
  coupang: "쿠팡",
  naver: "네이버쇼핑",
  musinsa: "무신사",
} as const;

export const STATUS_LABELS = {
  purchase: "구매",
  cancel: "취소",
  refund: "환불",
  sub: "정기결제",
  subscription: "구독",
} as const;

export const TYPE_LABELS = {
  expense: "지출",
  income: "수입",
} as const;

export const SOURCE_LABELS = {
  OCR: "OCR",
  MANUAL: "수동 입력",
} as const;
