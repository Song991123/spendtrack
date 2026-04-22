/**
 * 역할: 여러 화면이 함께 참조하는 상수 데이터를 정의합니다.
 * 위치: src\constants\labels.ts
 */
export const PLATFORM_LABELS = {
  coupang: "쿠팡",
  naver: "네이버쇼핑",
  musinsa: "무신사",
  etc: "기타",
} as const;

export const STATUS_LABELS = {
  purchase: "구매",
  cancel: "취소",
  refund: "환불",
  sub: "정기결제",
  // "기타"는 지출·수입 어느 쪽에도 넣을 수 있는 폴백 상태로, 정해진 라벨(구매/환불 등)에
  // 깔끔히 들어맞지 않는 거래를 위한 탈출구입니다.
  etc: "기타",
} as const;

export const TYPE_LABELS = {
  expense: "지출",
  income: "수입",
} as const;

export const SOURCE_LABELS = {
  OCR: "OCR",
  MANUAL: "수동 입력",
} as const;

export const CATEGORY_LABELS = {
  living: "생활용품",
  fashion: "패션/의류",
  digital: "전자기기",
  food: "식품/음료",
  // "기타"는 사용자가 카테고리를 지정하지 않았을 때 자동으로 적용되는 폴백 카테고리입니다.
  // 어떤 경로(수동 입력, CSV 업로드, OCR 저장)를 타더라도 미지정이면 이 값으로 수렴됩니다.
  etc: "기타",
} as const;

/**
 * 카테고리를 지정하지 않은 거래에 자동으로 붙는 기본값 키입니다.
 * TxCategory와 타입이 같도록 const assertion으로 좁혀둡니다.
 */
export const DEFAULT_CATEGORY_KEY = "etc" as const;

/**
 * 한 거래(영수증)가 가질 수 있는 카테고리 최대 개수.
 * - 대부분의 거래는 1개로 충분하지만 대형몰(이마트·쿠팡 종합)처럼 2~3개가 자연스러운 케이스가 있어 3으로 열어둡니다.
 * - 4개 이상은 실질적으로 "여러 상품의 묶음 영수증"이라 UI/분석을 위해서는 상품(items) 단위로 쪼개는 편이 맞고,
 *   그래서 이 값을 넘기지 못하도록 수동 입력/OCR 편집 UI에서 체크박스를 비활성화합니다.
 */
export const MAX_CATEGORIES_PER_TX = 3;

