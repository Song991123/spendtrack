/**
 * 역할: 해당 페이지에서 사용하는 목업 데이터와 화면 표시용 가공 함수를 모아둔 파일입니다.
 * 위치: src\pages\Analysis\data.ts
 */
import type { KpiItem } from "./components/KpiStrip";
import type { PlatformBarItem } from "./components/PlatformBars";
import type { CategoryBarItem } from "./components/CategoryBars";
import type { RepeatItem } from "./components/RepeatTop3";
import type { SubscriptionItem } from "./components/SubscriptionList";
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
}

const MONTHLY_ANALYSIS_DATA: Record<string, AnalysisMockData> = {
  "2026-01": {
    summary: "1월은 연초 소비가 안정적으로 시작됐고, 생활용품과 겨울 의류가 중심이었어요.",
    kpis: [
      { key: "spend", label: "총 지출", value: 421000, delta: { tone: "down", text: "전월 대비 4.1%" } },
      { key: "count", label: "쇼핑 횟수", value: 10, unit: "건", sub: "주간 평균 수준" },
      { key: "avg", label: "평균 주문금액", value: 42100, delta: { tone: "down", text: "전월 대비 2%" } },
      { key: "refund", label: "환불·취소", value: 46000, sub: "환불 2건", valueColor: tokens.color.neg },
    ],
    platform: {
      items: [
        { label: "쿠팡", value: 182000, percent: 43, color: tokens.color.cat3 },
        { label: "네이버", value: 136000, percent: 32, color: tokens.color.cat2 },
        { label: "무신사", value: 103000, percent: 25, color: tokens.color.cat1 },
      ],
      totalSpend: 421000,
      totalIncome: 46000,
      netSpend: 375000,
    },
    category: [
      { label: "생활용품", percent: 35, color: tokens.color.cat2 },
      { label: "패션/의류", percent: 28, color: tokens.color.cat1 },
      { label: "전자기기", percent: 22, color: tokens.color.cat4 },
      { label: "식품/음료", percent: 15, color: tokens.color.cat3 },
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
  },
  "2026-02": {
    summary: "2월은 주요 액세서리와 데스크 셋업 결제로 평균 주문금액이 조금 커졌어요.",
    kpis: [
      { key: "spend", label: "총 지출", value: 468000, delta: { tone: "up", text: "전월 대비 11.2%" } },
      { key: "count", label: "쇼핑 횟수", value: 11, unit: "건", sub: "주간 평균 수준" },
      { key: "avg", label: "평균 주문금액", value: 42545, delta: { tone: "up", text: "전월 대비 1%" } },
      { key: "refund", label: "환불·취소", value: 51000, sub: "환불 2건", valueColor: tokens.color.neg },
    ],
    platform: {
      items: [
        { label: "쿠팡", value: 181000, percent: 39, color: tokens.color.cat3 },
        { label: "네이버", value: 173000, percent: 37, color: tokens.color.cat2 },
        { label: "무신사", value: 114000, percent: 24, color: tokens.color.cat1 },
      ],
      totalSpend: 468000,
      totalIncome: 51000,
      netSpend: 417000,
    },
    category: [
      { label: "전자기기", percent: 34, color: tokens.color.cat4 },
      { label: "생활용품", percent: 27, color: tokens.color.cat2 },
      { label: "패션/의류", percent: 24, color: tokens.color.cat1 },
      { label: "식품/음료", percent: 15, color: tokens.color.cat3 },
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
  },
  "2026-03": {
    summary: "3월은 봄 시즌 의류와 데스크 정리 소품이 동시에 늘면서 소비 폭이 커졌어요.",
    kpis: [
      { key: "spend", label: "총 지출", value: 534000, delta: { tone: "up", text: "전월 대비 14.1%" } },
      { key: "count", label: "쇼핑 횟수", value: 12, unit: "건", sub: "주간 평균 수준" },
      { key: "avg", label: "평균 주문금액", value: 44500, delta: { tone: "up", text: "전월 대비 4.6%" } },
      { key: "refund", label: "환불·취소", value: 63000, sub: "환불 2건", valueColor: tokens.color.neg },
    ],
    platform: {
      items: [
        { label: "쿠팡", value: 202000, percent: 38, color: tokens.color.cat3 },
        { label: "네이버", value: 180000, percent: 34, color: tokens.color.cat2 },
        { label: "무신사", value: 152000, percent: 28, color: tokens.color.cat1 },
      ],
      totalSpend: 534000,
      totalIncome: 63000,
      netSpend: 471000,
    },
    category: [
      { label: "패션/의류", percent: 33, color: tokens.color.cat1 },
      { label: "전자기기", percent: 29, color: tokens.color.cat4 },
      { label: "생활용품", percent: 23, color: tokens.color.cat2 },
      { label: "식품/음료", percent: 15, color: tokens.color.cat3 },
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
  },
  "2026-04": {
    summary: "4월은 최신 데이터 기준으로, 고가 패션과 전자 액세서리 결제가 겹치며 최근 흐름 중 가장 강한 소비가 나타났어요.",
    kpis: [
      { key: "spend", label: "총 지출", value: 589000, delta: { tone: "up", text: "전월 대비 10.3%" } },
      { key: "count", label: "쇼핑 횟수", value: 13, unit: "건", sub: "주간 평균보다 높음" },
      { key: "avg", label: "평균 주문금액", value: 45308, delta: { tone: "up", text: "전월 대비 1.8%" } },
      { key: "refund", label: "환불·취소", value: 74000, sub: "환불 2건, 취소 1건", valueColor: tokens.color.neg },
    ],
    platform: {
      items: [
        { label: "쿠팡", value: 228000, percent: 39, color: tokens.color.cat3 },
        { label: "네이버", value: 212000, percent: 36, color: tokens.color.cat2 },
        { label: "무신사", value: 149000, percent: 25, color: tokens.color.cat1 },
      ],
      totalSpend: 589000,
      totalIncome: 74000,
      netSpend: 515000,
    },
    category: [
      { label: "패션/의류", percent: 36, color: tokens.color.cat1 },
      { label: "전자기기", percent: 31, color: tokens.color.cat4 },
      { label: "생활용품", percent: 19, color: tokens.color.cat2 },
      { label: "식품/음료", percent: 14, color: tokens.color.cat3 },
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
  },
};

export const getAnalysisMockData = (monthKey: string) =>
  MONTHLY_ANALYSIS_DATA[monthKey] ?? MONTHLY_ANALYSIS_DATA["2026-04"];

