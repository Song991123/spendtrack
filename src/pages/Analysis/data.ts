/**
 * 역할: 해당 페이지에서 사용하는 목업 데이터와 화면 표시용 가공 함수를 모아둔 파일입니다.
 * 위치: src\pages\Analysis\data.ts
 */
import type { KpiItem } from "./components/KpiStrip";
import type { PlatformBarItem } from "./components/PlatformBars";
import type { CategoryBarItem } from "./components/CategoryBars";
import type { RepeatItem } from "./components/RepeatTop3";
import type { SubscriptionItem } from "./components/SubscriptionList";
import type { WeeklyDay } from "./components/WeeklyPattern";
import { tokens } from "../../styles/tokens";

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
  weekly: { days: WeeklyDay[]; note: string };
}

/**
 * 월별 요일 지출 합계 시드.
 * 배열은 월~일 순서로 고정해 컴포넌트에서 그대로 렌더됩니다.
 * 주말(금·토·일) 쪽에 큰 값을 몰아 주말 집중 경향을 시각적으로 살립니다.
 */
const WEEKLY_BY_MONTH: Record<string, { days: WeeklyDay[]; note: string }> = {
  "2026-01": {
    days: [
      { day: "월", amount: 42000 },
      { day: "화", amount: 31000 },
      { day: "수", amount: 35000 },
      { day: "목", amount: 48000 },
      { day: "금", amount: 76000, emphasize: true },
      { day: "토", amount: 118000, emphasize: true },
      { day: "일", amount: 71000, emphasize: true },
    ],
    note: "금·토·일에 전체의 **63%**가 집중돼요. 주말 쇼핑 한도를 정하면 지출 조절에 도움이 돼요.",
  },
  "2026-02": {
    days: [
      { day: "월", amount: 48000 },
      { day: "화", amount: 36000 },
      { day: "수", amount: 41000 },
      { day: "목", amount: 56000 },
      { day: "금", amount: 83000, emphasize: true },
      { day: "토", amount: 124000, emphasize: true },
      { day: "일", amount: 80000, emphasize: true },
    ],
    note: "금·토·일에 전체의 **61%**가 집중돼요. 평일 쪽 주문은 꾸준한 편이에요.",
  },
  "2026-03": {
    days: [
      { day: "월", amount: 53000 },
      { day: "화", amount: 38000 },
      { day: "수", amount: 45000 },
      { day: "목", amount: 61000 },
      { day: "금", amount: 94000, emphasize: true },
      { day: "토", amount: 137000, emphasize: true },
      { day: "일", amount: 106000, emphasize: true },
    ],
    note: "금·토·일에 전체의 **63%**가 집중돼요. 이번 달은 토요일 피크가 특히 높았어요.",
  },
  "2026-04": {
    days: [
      { day: "월", amount: 56000 },
      { day: "화", amount: 41000 },
      { day: "수", amount: 47000 },
      { day: "목", amount: 64000 },
      { day: "금", amount: 98000, emphasize: true },
      { day: "토", amount: 141000, emphasize: true },
      { day: "일", amount: 142000, emphasize: true },
    ],
    note: "금·토·일에 전체의 **65%**가 집중돼요. 주말 쇼핑 한도를 설정하면 지출 조절에 도움이 돼요.",
  },
};

const MONTHLY_ANALYSIS_DATA: Record<string, AnalysisMockData> = {
  "2026-01": {
    summary: "1월은 연초 소비가 **안정적으로 시작**됐고, **생활용품(35%)**과 **겨울 의류**가 중심이었어요. 지난달 대비 **지출은 −4.1% 감소**했어요.",
    kpis: [
      { key: "spend", label: "총 지출", value: 421000, delta: { tone: "down", text: "−4.1%" } },
      { key: "count", label: "쇼핑 횟수", value: 10, unit: "건", sub: "주간 평균 수준" },
      { key: "avg", label: "평균 주문금액", value: 42100, delta: { tone: "down", text: "−2%" } },
      { key: "refund", label: "환불·취소", value: 46000, sub: "환불 2건", valueColor: tokens.color.neg },
    ],
    platform: {
      items: [
        { label: "쿠팡", value: 182000, percent: 43, count: 4, color: tokens.color.cat3 },
        { label: "네이버", value: 136000, percent: 32, count: 3, color: tokens.color.cat2 },
        { label: "무신사", value: 103000, percent: 25, count: 3, color: tokens.color.cat1 },
      ],
      totalSpend: 421000,
      totalIncome: 46000,
      netSpend: 375000,
    },
    category: [
      { label: "생활용품", percent: 35, amount: 147000, color: tokens.color.cat2 },
      { label: "패션/의류", percent: 28, amount: 118000, color: tokens.color.cat1 },
      { label: "전자기기", percent: 22, amount: 93000, color: tokens.color.cat4 },
      { label: "식품/음료", percent: 15, amount: 63000, color: tokens.color.cat3 },
    ],
    repeat: [
      { rank: 1, title: "무선 청소기 필터", platform: "쿠팡", category: "생활용품", count: 3, amount: 52000 },
      { rank: 2, title: "커피 캡슐 60개입", platform: "네이버쇼핑", category: "식품/음료", count: 2, amount: 41000 },
      { rank: 3, title: "니트 롱슬리브", platform: "무신사", category: "패션/의류", count: 2, amount: 56000 },
    ],
    subscriptions: [
      { id: "s1", name: "넷플릭스", color: "#E11D48", nextDate: "1.21", amount: 17000 },
      { id: "s2", name: "유튜브 프리미엄", color: "#E11D48", nextDate: "1.25", amount: 14900 },
      { id: "s3", name: "멜론", color: tokens.color.cat2, nextDate: "1.28", amount: 10900 },
    ],
    subscriptionTotal: 42800,
    trend: {
      points: [
        { label: "8월", value: 396000 },
        { label: "9월", value: 402000 },
        { label: "10월", value: 437000 },
        { label: "11월", value: 448000 },
        { label: "12월", value: 439000 },
        { label: "1월", value: 421000 },
      ],
      average: 423833,
    },
    weekly: WEEKLY_BY_MONTH["2026-01"],
  },
  "2026-02": {
    summary: "2월은 주요 **액세서리**와 **데스크 셋업** 결제로 평균 주문금액이 **₩42,545**로 조금 커졌어요. 지난달 대비 **지출은 +11.2% 증가**했어요.",
    kpis: [
      { key: "spend", label: "총 지출", value: 468000, delta: { tone: "up", text: "+11.2%" } },
      { key: "count", label: "쇼핑 횟수", value: 11, unit: "건", sub: "주간 평균 수준" },
      { key: "avg", label: "평균 주문금액", value: 42545, delta: { tone: "up", text: "+1%" } },
      { key: "refund", label: "환불·취소", value: 51000, sub: "환불 2건", valueColor: tokens.color.neg },
    ],
    platform: {
      items: [
        { label: "쿠팡", value: 181000, percent: 39, count: 4, color: tokens.color.cat3 },
        { label: "네이버", value: 173000, percent: 37, count: 4, color: tokens.color.cat2 },
        { label: "무신사", value: 114000, percent: 24, count: 3, color: tokens.color.cat1 },
      ],
      totalSpend: 468000,
      totalIncome: 51000,
      netSpend: 417000,
    },
    category: [
      { label: "전자기기", percent: 34, amount: 159000, color: tokens.color.cat4 },
      { label: "생활용품", percent: 27, amount: 126000, color: tokens.color.cat2 },
      { label: "패션/의류", percent: 24, amount: 112000, color: tokens.color.cat1 },
      { label: "식품/음료", percent: 15, amount: 70000, color: tokens.color.cat3 },
    ],
    repeat: [
      { rank: 1, title: "멀티탭 충전 스탠드", platform: "네이버쇼핑", category: "전자기기", count: 3, amount: 78000 },
      { rank: 2, title: "욕실 정리 리필", platform: "쿠팡", category: "생활용품", count: 2, amount: 34000 },
      { rank: 3, title: "와이드 집업 재킷", platform: "무신사", category: "패션/의류", count: 2, amount: 84000 },
    ],
    subscriptions: [
      { id: "s1", name: "넷플릭스", color: "#E11D48", nextDate: "2.21", amount: 17000 },
      { id: "s2", name: "유튜브 프리미엄", color: "#E11D48", nextDate: "2.25", amount: 14900 },
      { id: "s3", name: "멜론", color: tokens.color.cat2, nextDate: "2.28", amount: 10900 },
    ],
    subscriptionTotal: 42800,
    trend: {
      points: [
        { label: "9월", value: 402000 },
        { label: "10월", value: 437000 },
        { label: "11월", value: 448000 },
        { label: "12월", value: 439000 },
        { label: "1월", value: 421000 },
        { label: "2월", value: 468000 },
      ],
      average: 435833,
    },
    weekly: WEEKLY_BY_MONTH["2026-02"],
  },
  "2026-03": {
    summary: "3월은 **봄 시즌 의류(33%)**와 **데스크 정리 소품**이 동시에 늘면서 총 지출이 **₩534,000**까지 커졌어요. 지난달 대비 **지출은 +14.1% 증가**했어요.",
    kpis: [
      { key: "spend", label: "총 지출", value: 534000, delta: { tone: "up", text: "+14.1%" } },
      { key: "count", label: "쇼핑 횟수", value: 12, unit: "건", sub: "주간 평균 수준" },
      { key: "avg", label: "평균 주문금액", value: 44500, delta: { tone: "up", text: "+4.6%" } },
      { key: "refund", label: "환불·취소", value: 63000, sub: "환불 2건", valueColor: tokens.color.neg },
    ],
    platform: {
      items: [
        { label: "쿠팡", value: 202000, percent: 38, count: 5, color: tokens.color.cat3 },
        { label: "네이버", value: 180000, percent: 34, count: 4, color: tokens.color.cat2 },
        { label: "무신사", value: 152000, percent: 28, count: 3, color: tokens.color.cat1 },
      ],
      totalSpend: 534000,
      totalIncome: 63000,
      netSpend: 471000,
    },
    category: [
      { label: "패션/의류", percent: 33, amount: 176000, color: tokens.color.cat1 },
      { label: "전자기기", percent: 29, amount: 155000, color: tokens.color.cat4 },
      { label: "생활용품", percent: 23, amount: 123000, color: tokens.color.cat2 },
      { label: "식품/음료", percent: 15, amount: 80000, color: tokens.color.cat3 },
    ],
    repeat: [
      { rank: 1, title: "블루투스 스피커", platform: "쿠팡", category: "전자기기", count: 2, amount: 121000 },
      { rank: 2, title: "와이드 워싱 카고", platform: "무신사", category: "패션/의류", count: 2, amount: 137000 },
      { rank: 3, title: "책상 정리 트레이", platform: "네이버쇼핑", category: "생활용품", count: 2, amount: 34000 },
    ],
    subscriptions: [
      { id: "s1", name: "넷플릭스", color: "#E11D48", nextDate: "3.21", amount: 17000 },
      { id: "s2", name: "유튜브 프리미엄", color: "#E11D48", nextDate: "3.25", amount: 14900 },
      { id: "s3", name: "멜론", color: tokens.color.cat2, nextDate: "3.28", amount: 10900 },
    ],
    subscriptionTotal: 42800,
    trend: {
      points: [
        { label: "10월", value: 437000 },
        { label: "11월", value: 448000 },
        { label: "12월", value: 439000 },
        { label: "1월", value: 421000 },
        { label: "2월", value: 468000 },
        { label: "3월", value: 534000 },
      ],
      average: 457833,
    },
    weekly: WEEKLY_BY_MONTH["2026-03"],
  },
  "2026-04": {
    summary: "4월은 취소 건을 제외한 실 지출은 **₩515,000**이에요. **패션/의류(36%)**가 가장 많이 쓰고 있고, **쿠팡** 비중이 가장 높아요. 지난달 대비 **지출은 +10.3% 증가**했어요.",
    kpis: [
      { key: "spend", label: "총 지출", value: 589000, delta: { tone: "up", text: "+10.3%" } },
      { key: "count", label: "쇼핑 횟수", value: 13, unit: "건", sub: "주간 평균보다 높음" },
      { key: "avg", label: "평균 주문금액", value: 45308, delta: { tone: "up", text: "+1.8%" } },
      { key: "refund", label: "환불·취소", value: 74000, sub: "환불 2건, 취소 1건", valueColor: tokens.color.neg },
    ],
    platform: {
      items: [
        { label: "쿠팡", value: 228000, percent: 39, count: 5, color: tokens.color.cat3 },
        { label: "네이버", value: 212000, percent: 36, count: 5, color: tokens.color.cat2 },
        { label: "무신사", value: 149000, percent: 25, count: 3, color: tokens.color.cat1 },
      ],
      totalSpend: 589000,
      totalIncome: 74000,
      netSpend: 515000,
    },
    category: [
      { label: "패션/의류", percent: 36, amount: 212000, color: tokens.color.cat1 },
      { label: "전자기기", percent: 31, amount: 183000, color: tokens.color.cat4 },
      { label: "생활용품", percent: 19, amount: 112000, color: tokens.color.cat2 },
      { label: "식품/음료", percent: 14, amount: 82000, color: tokens.color.cat3 },
    ],
    repeat: [
      { rank: 1, title: "에어조던 1 로우 07", platform: "쿠팡", category: "패션/의류", count: 3, amount: 139000 },
      { rank: 2, title: "갤럭시 버즈3 프로 케이스", platform: "네이버쇼핑", category: "전자기기", count: 2, amount: 79000 },
      { rank: 3, title: "세일러 워싱 올리브", platform: "무신사", category: "패션/의류", count: 2, amount: 129000 },
    ],
    subscriptions: [
      { id: "s1", name: "넷플릭스", color: "#E11D48", nextDate: "4.21", amount: 17000 },
      { id: "s2", name: "유튜브 프리미엄", color: "#E11D48", nextDate: "4.25", amount: 14900 },
      { id: "s3", name: "멜론", color: tokens.color.cat2, nextDate: "4.28", amount: 10900 },
    ],
    subscriptionTotal: 42800,
    trend: {
      points: [
        { label: "11월", value: 448000 },
        { label: "12월", value: 439000 },
        { label: "1월", value: 421000 },
        { label: "2월", value: 468000 },
        { label: "3월", value: 534000 },
        { label: "4월", value: 589000 },
      ],
      average: 483167,
    },
    weekly: WEEKLY_BY_MONTH["2026-04"],
  },
};

export const getAnalysisMockData = (monthKey: string) =>
  MONTHLY_ANALYSIS_DATA[monthKey] ?? MONTHLY_ANALYSIS_DATA["2026-04"];

