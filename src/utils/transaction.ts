import type {
  PlatformId,
  StatusTag,
  TransactionType,
} from "../types/transaction";

export const platformLabel = (id: PlatformId): string => {
  const map: Record<PlatformId, string> = {
    coupang: "쿠팡",
    naver: "네이버쇼핑",
    musinsa: "무신사",
    other: "기타",
  };

  return map[id];
};

export const platformColor = (id: PlatformId): string => {
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
  const map: Record<StatusTag, string> = {
    purchase: "구매",
    refund: "환불",
    cancel: "취소",
    return: "반품",
    recurring: "정기결제",
    subscription: "구독",
  };

  return map[tag];
};

export const typeLabel = (type: TransactionType): string =>
  type === "expense" ? "지출" : "수입";

export const formatAmount = (
  amount: number,
  type: TransactionType
): string => {
  const prefix = type === "expense" ? "-" : "+";
  return `${prefix}₩${amount.toLocaleString("ko-KR")}`;
};
