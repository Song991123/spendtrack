/**
 * 역할: 여러 화면이 함께 참조하는 상수 데이터를 정의합니다.
 * 위치: src\constants\months.ts
 */
export interface MonthOption {
  key: string;
  label: string;
  stamp: string;
}

export const MONTH_OPTIONS: MonthOption[] = [
  { key: "2026-01", label: "2026년 1월", stamp: "2026년 1월 20일 기준" },
  { key: "2026-02", label: "2026년 2월", stamp: "2026년 2월 20일 기준" },
  { key: "2026-03", label: "2026년 3월", stamp: "2026년 3월 20일 기준" },
  { key: "2026-04", label: "2026년 4월", stamp: "2026년 4월 20일 기준" },
];

export const LATEST_MONTH_KEY = MONTH_OPTIONS[MONTH_OPTIONS.length - 1].key;

export const getMonthOption = (key: string) =>
  MONTH_OPTIONS.find((option) => option.key === key) ?? MONTH_OPTIONS[MONTH_OPTIONS.length - 1];

