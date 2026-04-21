/**
 * 역할: 해당 페이지에서 사용하는 목업 데이터와 화면 표시용 가공 함수를 모아둔 파일입니다.
 * 위치: src\pages\Transactions\data.ts
 */
import type { SummaryData } from "./components/SummaryStrip";
import type {
  TxCategory,
  TxPlatform,
  TxRow,
  TxStatus,
  TxType,
} from "./components/TransactionTable";

export interface TransactionsMockData {
  summary: SummaryData;
  rows: TxRow[];
}

const TITLE_POOLS: Record<TxCategory, string[]> = {
  living: [
    "무선 청소기 필터",
    "책상 정리 트레이",
    "주방 세제 리필",
    "데스크 매트 XL",
    "욕실 발매트",
    "제습제 3P 세트",
    "LED 무드 스탠드",
    "소형 탁상 선풍기",
    "스테인리스 물병",
    "세탁 볼 세트",
  ],
  fashion: [
    "에어조던 1 로우 07",
    "와이드 파우치",
    "세일러 워싱 올리브",
    "와이드 집업 재킷",
    "패딩 베스트 블랙",
    "오버핏 스웻셔츠",
    "리넨 하프 셔츠",
    "슬림 기모 슬랙스",
    "코튼 후디 그레이",
    "크로스 숄더백",
  ],
  digital: [
    "갤럭시 버즈3 프로 케이스",
    "블루투스 스피커",
    "멀티탭 충전 스탠드",
    "USB-C 허브 7in1",
    "무선 기계식 키보드",
    "모니터 암 싱글",
    "고속 무선 충전기",
    "게이밍 마우스",
    "4K 웹캠",
    "노이즈 캔슬링 이어폰",
  ],
  food: [
    "홈카페 원두 1kg",
    "유기농 파스타면",
    "그릭 요거트 세트",
    "견과류 믹스 박스",
    "초콜릿 선물세트",
    "그래놀라 500g",
    "오트밀크 12팩",
    "캡슐 커피 120개",
    "건조과일 팩",
    "홍차 컬렉션",
  ],
  // "기타"는 사용자가 카테고리를 지정하지 않은 거래의 기본값이라 seed에서도 분류가 애매한 타이틀만 담았습니다.
  etc: [
    "기타 주문",
    "용도 미분류",
    "판매자 증정품",
    "포장 박스 구입",
    "기프티콘 교환",
    "이벤트 경품 교환",
    "디지털 상품권",
    "소량 구매",
  ],
};

const SUBSCRIPTIONS: Array<{
  title: string;
  price: number;
  platform: TxPlatform;
  category: TxCategory;
}> = [
  { title: "넷플릭스 스탠다드", price: 13500, platform: "coupang", category: "digital" },
  { title: "쿠팡 와우 멤버십", price: 7890, platform: "coupang", category: "living" },
  { title: "네이버플러스 멤버십", price: 4900, platform: "naver", category: "digital" },
  { title: "유튜브 프리미엄", price: 14900, platform: "coupang", category: "digital" },
  { title: "스포티파이 개인", price: 13900, platform: "naver", category: "digital" },
  { title: "밀리의 서재", price: 9900, platform: "naver", category: "digital" },
];

const REFUND_TITLES = ["부분 환불", "주문 환불", "상품 환불", "배송 오류 환불"];

const AMOUNT_RANGE: Record<TxCategory, [number, number]> = {
  living: [8000, 85000],
  fashion: [29000, 210000],
  digital: [19000, 410000],
  food: [9000, 95000],
  // "기타"는 성격이 다양해서 범위를 넓게 잡았습니다.
  etc: [5000, 120000],
};

const PLATFORM_WEIGHT: Array<[TxPlatform, number]> = [
  ["coupang", 40],
  ["naver", 35],
  ["musinsa", 25],
];

const CATEGORY_WEIGHT: Array<[TxCategory, number]> = [
  ["living", 28],
  ["fashion", 30],
  ["digital", 28],
  ["food", 14],
];

const STATUS_WEIGHT: Array<[TxStatus, number]> = [
  ["purchase", 74],
  ["refund", 10],
  ["cancel", 9],
  ["sub", 7],
];

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickWeighted<T>(rand: () => number, items: Array<[T, number]>): T {
  const total = items.reduce((sum, [, weight]) => sum + weight, 0);
  let r = rand() * total;
  for (const [item, weight] of items) {
    r -= weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1][0];
}

function pickFrom<T>(rand: () => number, pool: T[]): T {
  return pool[Math.floor(rand() * pool.length)];
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

// 플랫폼별로 상품명을 넣으면 검색 결과로 열릴 만한 URL 패턴을 가지고 있습니다.
// 실제 상품 URL이 아니어도 사용자가 해당 플랫폼에서 바로 상품을 확인할 수 있도록 돕습니다.
const PLATFORM_SEARCH_URL: Record<TxPlatform, (q: string) => string> = {
  coupang: (q) =>
    `https://www.coupang.com/np/search?q=${encodeURIComponent(q)}`,
  naver: (q) => `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(q)}`,
  musinsa: (q) => `https://www.musinsa.com/search/musinsa/goods?q=${encodeURIComponent(q)}`,
};

function daysInMonth(monthKey: string): number {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function formatDate(monthKey: string, day: number): string {
  return `${monthKey.replace("-", ".")}.${String(day).padStart(2, "0")}`;
}

const TOTAL_ROWS_PER_MONTH = 62;

function generateRows(monthKey: string): TxRow[] {
  const rand = mulberry32(hashString(monthKey));
  const totalDays = daysInMonth(monthKey);
  const rows: TxRow[] = [];

  for (let i = 0; i < TOTAL_ROWS_PER_MONTH; i += 1) {
    const status = pickWeighted(rand, STATUS_WEIGHT);
    const day = Math.min(totalDays, Math.max(1, Math.ceil(rand() * totalDays)));
    const date = formatDate(monthKey, day);
    const id = `${monthKey}-${i + 1}`;

    let row: TxRow;

    if (status === "sub") {
      const sub = pickFrom(rand, SUBSCRIPTIONS);
      row = {
        id,
        type: "expense",
        date,
        platform: sub.platform,
        category: sub.category,
        title: sub.title,
        amount: -sub.price,
        status: "sub",
      };
    } else if (status === "refund") {
      const category = pickWeighted(rand, CATEGORY_WEIGHT);
      const platform = pickWeighted(rand, PLATFORM_WEIGHT);
      const [lo, hi] = AMOUNT_RANGE[category];
      const price = roundTo(lo + rand() * (hi - lo) * 0.7, 1000);
      row = {
        id,
        type: "income",
        date,
        platform,
        category,
        title: pickFrom(rand, REFUND_TITLES),
        amount: price,
        status: "refund",
      };
    } else {
      const category = pickWeighted(rand, CATEGORY_WEIGHT);
      const platform = pickWeighted(rand, PLATFORM_WEIGHT);
      const [lo, hi] = AMOUNT_RANGE[category];
      const price = roundTo(lo + rand() * (hi - lo), 1000);
      const title = pickFrom(rand, TITLE_POOLS[category]);
      const type: TxType = "expense";
      const useDetail = rand() < 0.55;
      const source: "OCR" | "MANUAL" = rand() < 0.5 ? "OCR" : "MANUAL";
      // 대부분의 상품에 링크를 달아두되, 일부는 일부러 비워서 "링크 없는 케이스"도 UI에서 확인할 수 있게 합니다.
      const withLink = rand() < 0.7;
      const link = withLink ? PLATFORM_SEARCH_URL[platform](title) : undefined;
      row = {
        id,
        type,
        date,
        platform,
        category,
        title,
        amount: -price,
        status,
        ...(useDetail
          ? {
              detail: {
                items: [{ name: title, price, ...(link ? { link } : {}) }],
                source,
              },
            }
          : {}),
      };
    }

    rows.push(row);
  }

  return rows.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

const CACHE = new Map<string, TxRow[]>();

function getRowsForMonth(monthKey: string): TxRow[] {
  const cached = CACHE.get(monthKey);
  if (cached) return cached;
  const rows = generateRows(monthKey);
  CACHE.set(monthKey, rows);
  return rows;
}

function sumSpend(rows: TxRow[]): number {
  return rows
    .filter((row) => row.type === "expense")
    .reduce((sum, row) => sum + Math.abs(Math.min(row.amount, 0)), 0);
}

export const buildTransactionSummary = (
  rows: TxRow[],
  prevRows?: TxRow[],
): SummaryData => {
  const total = rows.length;
  const spendRows = rows.filter((row) => row.type === "expense");
  const incomeRows = rows.filter((row) => row.type === "income");
  const totalSpend = spendRows.reduce((sum, row) => sum + Math.abs(Math.min(row.amount, 0)), 0);
  const incomeAndRefund = incomeRows.reduce((sum, row) => sum + Math.max(row.amount, 0), 0);
  const refundCount = rows.filter((row) => row.status === "refund").length;

  let spendDelta: SummaryData["spendDelta"];
  if (prevRows && prevRows.length > 0) {
    const prevSpend = sumSpend(prevRows);
    if (prevSpend > 0) {
      const ratio = (totalSpend - prevSpend) / prevSpend;
      const percent = Math.round(ratio * 100);
      spendDelta = {
        percent,
        direction: percent > 0 ? "up" : percent < 0 ? "down" : "flat",
      };
    }
  }

  return {
    total,
    spendCount: spendRows.length,
    incomeCount: incomeRows.length,
    totalSpend,
    incomeAndRefund,
    refundCount,
    netSpend: totalSpend - incomeAndRefund,
    countLabel: `총 ${total}건 · 지출 ${spendRows.length}건 · 수입 ${incomeRows.length}건`,
    spendDelta,
  };
};

/** "2026-04" → "2026-03"처럼 한 달 앞 키를 반환. */
export const getPrevMonthKey = (monthKey: string): string => {
  const [yearStr, monthStr] = monthKey.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!year || !month) return monthKey;
  const prevMonthIdx = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  return `${prevYear}-${String(prevMonthIdx).padStart(2, "0")}`;
};

export const getTransactionsMockData = (monthKey: string): TransactionsMockData => {
  const rows = getRowsForMonth(monthKey);
  return {
    rows,
    summary: buildTransactionSummary(rows),
  };
};

