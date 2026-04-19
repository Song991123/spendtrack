/**
 * 역할: 화면 컴포넌트 밖으로 분리한 공통 계산 또는 포맷팅 로직입니다.
 * 위치: src\utils\transaction.ts
 */
import type {
  PlatformId,
  StatusTag,
  TransactionType,
} from "../types/transaction";

export const platformLabel = (id: PlatformId): string => {
  // 화면에서는 코드값 대신 사람이 읽는 한글 플랫폼명을 사용합니다.
  const map: Record<PlatformId, string> = {
    coupang: "쿠팡",
    naver: "네이버쇼핑",
    musinsa: "무신사",
    other: "기타",
  };

  return map[id];
};

export const platformColor = (id: PlatformId): string => {
  // 플랫폼별 강조색을 고정해 태그/배지 UI에서 재사용합니다.
  const map: Record<PlatformId, string> = {
    coupang: "#FF4B00",
    naver: "#03C75A",
    musinsa: "#222222",
    other: "#6B7280",
  };

  return map[id];
};

export const platformInitial = (id: PlatformId): string => {
  const map: Record<PlatformId, string> = {
    coupang: "C",
    naver: "N",
    musinsa: "M",
    other: "?",
  };

  return map[id];
};

export const statusLabel = (tag: StatusTag): string => {
  // 상태 태그는 여러 화면에서 같은 용어를 써야 하므로 여기서 통일합니다.
  const map: Record<StatusTag, string> = {
    purchase: "구매",
    refund: "환불",
    cancel: "취소",
    return: "반품",
    recurring: "정기결제",
    sub: "정기결제",
  };

  return map[tag];
};

export const typeLabel = (type: TransactionType): string =>
  type === "expense" ? "지출" : "수입";

export const formatAmount = (
  amount: number,
  type: TransactionType
): string => {
  // 수입/지출 부호를 한 번에 맞춰 표시하기 위한 공통 포맷 함수입니다.
  const prefix = type === "expense" ? "-" : "+";
  return `${prefix}${amount.toLocaleString("ko-KR")}원`;
};

