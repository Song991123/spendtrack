export const formatKRW = (value: number): string => {
  return `₩${Math.round(value).toLocaleString("ko-KR")}`;
};

export const formatNumber = (value: number): string => {
  return value.toLocaleString("ko-KR");
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatDateDot = (value: string): string => {
  return value.replaceAll("-", ".");
};

export const parsePrice = (value: string): number => {
  return Number(value.replace(/[^\d]/g, ""));
};
