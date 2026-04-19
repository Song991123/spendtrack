import type { KpiItem } from "./components/KpiStrip";
import type { PlatformBarItem } from "./components/PlatformBars";
import type { CategoryBarItem } from "./components/CategoryBars";
import type { RepeatItem } from "./components/RepeatTop3";
import type { SubscriptionItem } from "./components/SubscriptionList";

export interface AnalysisMockData {
  summary: string;
  kpis: KpiItem[];
  platform: {
    items: PlatformBarItem[];
    totalSpend: number;
    totalIncome: number;
    netSpend: number;
  };
  category: CategoryBarItem[];
  repeat: RepeatItem[];
  subscriptions: SubscriptionItem[];
  subscriptionTotal: number;
  trend: { points: { label: string; value: number }[]; average: number };
}

export const analysisMockData: AnalysisMockData = {
  summary:
    "취소 건을 제외하면 순지출은 378,500원이고, 패션/의류(47%) 비중이 가장 높아요. 쿠팡 비중도 절반 이상으로 유지되고 있어요.",
  kpis: [
    { key: "spend", label: "총 지출", value: 463500, delta: { tone: "up", text: "전월 대비 +8.2%" } },
    { key: "count", label: "쇼핑 횟수", value: 12, unit: "건", sub: "이번 달 누적" },
    { key: "avg", label: "평균 주문금액", value: 38625, delta: { tone: "up", text: "전월 대비 +12%" } },
    { key: "refund", label: "환불·취소", value: 189000, sub: "이번 달 1건(취소)", valueColor: "#B42318" },
  ],
  platform: {
    items: [
      { label: "쿠팡", value: 245000, percent: 53, color: "#B45309" },
      { label: "네이버", value: 158000, percent: 34, color: "#0E9488" },
      { label: "무신사", value: 60500, percent: 13, color: "#4F46E5" },
    ],
    totalSpend: 463500,
    totalIncome: 85000,
    netSpend: 378500,
  },
  category: [
    { label: "패션/의류", percent: 47, color: "#4F46E5" },
    { label: "전자기기", percent: 41, color: "#9F1239" },
    { label: "생활용품", percent: 7, color: "#0E9488" },
    { label: "식품/음료", percent: 4, color: "#B45309" },
  ],
  repeat: [
    { rank: 1, title: "진라면 매운맛 40개입", platform: "쿠팡", category: "식품/음료", count: 3, amount: 55500 },
    { rank: 2, title: "스타벅스 아메리카노 원두 1kg", platform: "네이버쇼핑", category: "식품/음료", count: 2, amount: 70000 },
    { rank: 3, title: "핸드워시 리필 400ml", platform: "쿠팡", category: "생활용품", count: 2, amount: 26000 },
  ],
  subscriptions: [
    { id: "s1", name: "넷플릭스", color: "#E11D48", nextDate: "4.20", amount: 13900 },
    { id: "s2", name: "유튜브 프리미엄", color: "#E11D48", nextDate: "4.25", amount: 14900 },
    { id: "s3", name: "멜론", color: "#0E9488", nextDate: "5.01", amount: 10900 },
  ],
  subscriptionTotal: 39700,
  trend: {
    points: [
      { label: "11월", value: 512000 },
      { label: "12월", value: 680000 },
      { label: "1월", value: 498000 },
      { label: "2월", value: 612000 },
      { label: "3월", value: 756400 },
      { label: "4월", value: 847200 },
    ],
    average: 623917,
  },
};
