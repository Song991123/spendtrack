import type { KpiItem } from "./components/KpiStrip";
import type { DonutItem } from "./components/PlatformDonut";
import type { RecentItem } from "./components/RecentTransactions";
import type { InsightItem } from "./components/InsightCards";

export interface HomeMockData {
  kpis: KpiItem[];
  platformDonut: { total: number; items: DonutItem[] };
  trend: { points: { label: string; value: number }[]; average: number };
  recent: RecentItem[];
  insights: InsightItem[];
}

export const homeMockData: HomeMockData = {
  kpis: [
    {
      key: "spend",
      label: "총 지출",
      value: 847200,
      delta: { tone: "up", text: "전월 대비 +12%" },
      sub: "전월 대비 +56,400원",
      spark: [620, 680, 710, 690, 780, 847],
    },
    {
      key: "income",
      label: "이번 달 총 수입",
      value: 58000,
      dotColor: "#F59E0B",
      sub: "환불 1건, 취소 1건",
    },
    {
      key: "refund",
      label: "환불·취소 금액",
      value: 58000,
      sub: "환불 29,000원, 취소 29,000원",
    },
  ],
  platformDonut: {
    total: 847200,
    items: [
      { label: "쿠팡", value: 342500, percent: 40, color: "#F59E0B" },
      { label: "네이버쇼핑", value: 285000, percent: 34, color: "#0E9488" },
      { label: "무신사", value: 219700, percent: 26, color: "#4F46E5" },
    ],
  },
  trend: {
    points: [
      { label: "11월", value: 512000 },
      { label: "12월", value: 680000 },
      { label: "1월", value: 498000 },
      { label: "2월", value: 612000 },
      { label: "3월", value: 756400 },
      { label: "4월", value: 847200 },
    ],
    average: 687867,
  },
  recent: [
    {
      id: "1",
      initial: "C",
      platform: "coupang",
      title: "에어포스 1 로우",
      date: "2025.04.14",
      amount: -129000,
    },
    {
      id: "2",
      initial: "N",
      platform: "naver",
      title: "삼성 버즈2 프로 케이스",
      date: "2025.04.12",
      amount: -189000,
    },
    {
      id: "3",
      initial: "M",
      platform: "musinsa",
      title: "언더아머 스웻셔츠 차콜",
      date: "2025.04.10",
      amount: -89000,
    },
  ],
  insights: [
    {
      id: "i1",
      kind: "warn",
      title: "이번 달 쿠팡 지출이 평균보다 높아요.",
      body: "최근 3개월 평균 278,000원 대비 이번 달은 342,500원으로 23% 증가했어요.",
    },
    {
      id: "i2",
      kind: "repeat",
      title: "반복 구매 패턴이 감지됐어요.",
      body: "네이버쇼핑에서 반복 구매하는 상품 2개가 보여요.",
    },
    {
      id: "i3",
      kind: "category",
      title: "패션/의류 지출 비중이 높아요.",
      body: "전체 소비의 52%가 패션/의류예요. 지난달보다 14,000원 늘었어요.",
    },
  ],
};
