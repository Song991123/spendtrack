/**
 * 역할: 해당 페이지에서 사용하는 목업 데이터와 화면 표시용 가공 함수를 모아둔 파일입니다.
 * 위치: src\pages\Home\data.ts
 */
import type { KpiItem } from "./components/KpiStrip";
import type { DonutItem } from "./components/PlatformDonut";
import type { RecentItem } from "./components/RecentTransactions";
import type { InsightItem } from "./components/InsightCards";
import { tokens } from "../../styles/tokens";

export interface HomeMockData {
  kpis: KpiItem[];
  platformDonut: { total: number; items: DonutItem[] };
  trend: { points: { label: string; value: number }[] };
  recent: RecentItem[];
  insights: InsightItem[];
}

const MONTHLY_HOME_DATA: Record<string, HomeMockData> = {
  "2026-01": {
    kpis: [
      {
        key: "spend",
        label: "총 지출",
        value: 684000,
        primary: true,
        neuChip: "이번 달",
        delta: { tone: "down", text: "전월 대비 3%" },
        sub: "연초 소비가 비교적 안정적으로 시작됐어요.",
        spark: [720, 710, 702, 698, 691, 684],
      },
      {
        key: "income",
        label: "총 수입 · 환불",
        value: 46000,
        dotColor: tokens.color.pos,
        valueColor: tokens.color.pos,
        valuePrefix: "+",
        sub: "환불 1건, 기타 정산 1건",
      },
      {
        key: "refund",
        label: "환불·취소 금액",
        value: 46000,
        dotColor: tokens.color.neg,
        sub: "환불 32,000원, 취소 14,000원",
      },
    ],
    platformDonut: {
      total: 684000,
      items: [
        { label: "쿠팡", value: 276000, percent: 40, color: tokens.color.warn, count: 9 },
        { label: "네이버쇼핑", value: 221000, percent: 32, color: tokens.color.cat2, count: 6 },
        { label: "무신사", value: 187000, percent: 28, color: tokens.color.cat1, count: 5 },
      ],
    },
    trend: {
      points: [
        { label: "2월", value: 552000 },
        { label: "3월", value: 588000 },
        { label: "4월", value: 615000 },
        { label: "5월", value: 640000 },
        { label: "6월", value: 598000 },
        { label: "7월", value: 620000 },
        { label: "8월", value: 612000 },
        { label: "9월", value: 655000 },
        { label: "10월", value: 704000 },
        { label: "11월", value: 732000 },
        { label: "12월", value: 706000 },
        { label: "1월", value: 684000 },
      ],
    },
    recent: [
      { id: "1", initial: "C", platform: "coupang", title: "무선 청소기 필터", date: "2026.01.18", amount: -52000 },
      { id: "2", initial: "N", platform: "naver", title: "멀티탭 충전 스탠드", date: "2026.01.15", amount: -78000 },
      { id: "3", initial: "M", platform: "musinsa", title: "패딩 베스트 블랙", date: "2026.01.12", amount: -99000 },
    ],
    insights: [
      { id: "i1", kind: "warn", title: "쿠팡 비중이 가장 높아요.", body: "필수 생활용품 구매가 몰리면서 쿠팡 비중이 40%까지 올라왔어요." },
      { id: "i2", kind: "repeat", title: "겨울 시즌 의류 결제가 이어졌어요.", body: "무신사에서 아우터와 레이어드 아이템 주문이 반복적으로 잡히고 있어요." },
      { id: "i3", kind: "category", title: "생활용품 지출은 안정적인 편이에요.", body: "큰 변동 없이 최근 평균 범위 안에서 유지되고 있습니다." },
    ],
  },
  "2026-02": {
    kpis: [
      {
        key: "spend",
        label: "총 지출",
        value: 742000,
        primary: true,
        neuChip: "이번 달",
        delta: { tone: "up", text: "전월 대비 9%" },
        sub: "전자기기 액세서리 지출이 늘었어요.",
        spark: [684, 692, 701, 720, 734, 742],
      },
      {
        key: "income",
        label: "총 수입 · 환불",
        value: 51000,
        dotColor: tokens.color.pos,
        valueColor: tokens.color.pos,
        valuePrefix: "+",
        sub: "환불 1건, 취소 1건",
      },
      {
        key: "refund",
        label: "환불·취소 금액",
        value: 51000,
        dotColor: tokens.color.neg,
        sub: "환불 39,000원, 취소 12,000원",
      },
    ],
    platformDonut: {
      total: 742000,
      items: [
        { label: "쿠팡", value: 288000, percent: 39, color: tokens.color.warn, count: 11 },
        { label: "네이버쇼핑", value: 262000, percent: 35, color: tokens.color.cat2, count: 7 },
        { label: "무신사", value: 192000, percent: 26, color: tokens.color.cat1, count: 4 },
      ],
    },
    trend: {
      points: [
        { label: "3월", value: 588000 },
        { label: "4월", value: 615000 },
        { label: "5월", value: 640000 },
        { label: "6월", value: 598000 },
        { label: "7월", value: 620000 },
        { label: "8월", value: 612000 },
        { label: "9월", value: 655000 },
        { label: "10월", value: 704000 },
        { label: "11월", value: 732000 },
        { label: "12월", value: 706000 },
        { label: "1월", value: 684000 },
        { label: "2월", value: 742000 },
      ],
    },
    recent: [
      { id: "1", initial: "C", platform: "coupang", title: "커피머신 연장봉", date: "2026.02.17", amount: -29000 },
      { id: "2", initial: "N", platform: "naver", title: "와이드 파우치", date: "2026.02.13", amount: -69000 },
      { id: "3", initial: "M", platform: "musinsa", title: "와이드 집업 재킷", date: "2026.02.09", amount: -84000 },
    ],
    insights: [
      { id: "i1", kind: "warn", title: "네이버쇼핑 지출이 커졌어요.", body: "주문 액세서리와 생활소품 결제가 늘면서 비중이 35%까지 올라왔어요." },
      { id: "i2", kind: "repeat", title: "카페·생활용품 구매가 이어졌어요.", body: "리필 제품과 소모품 주문이 비슷한 패턴으로 반복되고 있어요." },
      { id: "i3", kind: "category", title: "패션 지출은 아직 통제되는 편이에요.", body: "무신사 비중은 유지되고 있지만 급격하게 커지진 않았어요." },
    ],
  },
  "2026-03": {
    kpis: [
      {
        key: "spend",
        label: "총 지출",
        value: 823000,
        primary: true,
        neuChip: "이번 달",
        delta: { tone: "up", text: "전월 대비 11%" },
        sub: "신학기·봄맞이 소비가 반영됐어요.",
        spark: [742, 754, 771, 788, 804, 823],
      },
      {
        key: "income",
        label: "총 수입 · 환불",
        value: 63000,
        dotColor: tokens.color.pos,
        valueColor: tokens.color.pos,
        valuePrefix: "+",
        sub: "환불 2건, 취소 0건",
      },
      {
        key: "refund",
        label: "환불·취소 금액",
        value: 63000,
        dotColor: tokens.color.neg,
        sub: "환불 63,000원",
      },
    ],
    platformDonut: {
      total: 823000,
      items: [
        { label: "쿠팡", value: 311000, percent: 38, color: tokens.color.warn, count: 10 },
        { label: "네이버쇼핑", value: 276000, percent: 34, color: tokens.color.cat2, count: 9 },
        { label: "무신사", value: 236000, percent: 28, color: tokens.color.cat1, count: 6 },
      ],
    },
    trend: {
      points: [
        { label: "4월", value: 615000 },
        { label: "5월", value: 640000 },
        { label: "6월", value: 598000 },
        { label: "7월", value: 620000 },
        { label: "8월", value: 612000 },
        { label: "9월", value: 655000 },
        { label: "10월", value: 704000 },
        { label: "11월", value: 732000 },
        { label: "12월", value: 706000 },
        { label: "1월", value: 684000 },
        { label: "2월", value: 742000 },
        { label: "3월", value: 823000 },
      ],
    },
    recent: [
      { id: "1", initial: "C", platform: "coupang", title: "블루투스 스피커", date: "2026.03.18", amount: -121000 },
      { id: "2", initial: "N", platform: "naver", title: "책상 정리 트레이", date: "2026.03.16", amount: -34000 },
      { id: "3", initial: "M", platform: "musinsa", title: "와이드 워싱 카고", date: "2026.03.11", amount: -137000 },
    ],
    insights: [
      { id: "i1", kind: "warn", title: "봄 시즌 패션 지출이 늘었어요.", body: "아우터 외에 추가 결제가 겹치면서 무신사 비중이 다시 커졌습니다." },
      { id: "i2", kind: "repeat", title: "가전 주변기기 구매가 이어졌어요.", body: "네이버쇼핑에서 데스크 셋업 관련 상품을 연속으로 구매했어요." },
      { id: "i3", kind: "category", title: "고가 건당 구매가 눈에 띄어요.", body: "3월은 중간 금액대보다 큰 거래가 여러 번 발생했습니다." },
    ],
  },
  "2026-04": {
    kpis: [
      {
        key: "spend",
        label: "총 지출",
        value: 918000,
        primary: true,
        neuChip: "이번 달",
        delta: { tone: "up", text: "전월 대비 12%" },
        sub: "프로토타입 기준 최신 데이터예요.",
        spark: [790, 812, 830, 861, 892, 918],
      },
      {
        key: "income",
        label: "총 수입 · 환불",
        value: 74000,
        dotColor: tokens.color.pos,
        valueColor: tokens.color.pos,
        valuePrefix: "+",
        sub: "환불 2건, 기타 반환 1건",
      },
      {
        key: "refund",
        label: "환불·취소 금액",
        value: 74000,
        dotColor: tokens.color.neg,
        sub: "환불 58,000원, 취소 16,000원",
      },
    ],
    platformDonut: {
      total: 918000,
      items: [
        { label: "쿠팡", value: 356000, percent: 39, color: tokens.color.warn, count: 12 },
        { label: "네이버쇼핑", value: 321000, percent: 35, color: tokens.color.cat2, count: 8 },
        { label: "무신사", value: 241000, percent: 26, color: tokens.color.cat1, count: 5 },
      ],
    },
    trend: {
      points: [
        { label: "5월", value: 640000 },
        { label: "6월", value: 598000 },
        { label: "7월", value: 620000 },
        { label: "8월", value: 612000 },
        { label: "9월", value: 655000 },
        { label: "10월", value: 704000 },
        { label: "11월", value: 732000 },
        { label: "12월", value: 706000 },
        { label: "1월", value: 684000 },
        { label: "2월", value: 742000 },
        { label: "3월", value: 823000 },
        { label: "4월", value: 918000 },
      ],
    },
    recent: [
      { id: "1", initial: "C", platform: "coupang", title: "에어조던 1 로우 07", date: "2026.04.19", amount: -139000 },
      { id: "2", initial: "N", platform: "naver", title: "갤럭시 버즈3 프로 케이스", date: "2026.04.17", amount: -79000 },
      { id: "3", initial: "M", platform: "musinsa", title: "세일러 워싱 올리브", date: "2026.04.14", amount: -129000 },
    ],
    insights: [
      { id: "i1", kind: "warn", title: "최신 달 소비 강도가 가장 높아요.", body: "최근 6개월 중 4월 지출이 최고치예요. 고가 결제가 3건 포함돼 있어요." },
      { id: "i2", kind: "repeat", title: "플랫폼별 사용 패턴이 뚜렷해졌어요.", body: "생활용품은 쿠팡, 전자 액세서리는 네이버쇼핑으로 모이는 경향이 보입니다." },
      { id: "i3", kind: "category", title: "패션과 전자 소비가 동시에 커졌어요.", body: "무신사와 네이버 비중이 함께 올라가면서 전체 지출 규모가 커졌습니다." },
    ],
  },
};

export const getHomeMockData = (monthKey: string) =>
  MONTHLY_HOME_DATA[monthKey] ?? MONTHLY_HOME_DATA["2026-04"];

