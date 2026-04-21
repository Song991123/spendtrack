/**
 * 역할: Analysis 화면에 필요한 지표(KPI, 플랫폼/카테고리 비중, 반복구매,
 *       정기결제, 월간 추이, 요일 패턴)를 실시간 거래 데이터로부터 파생시키는 빌더.
 *       Firestore 이관 시 입력 rows만 교체하면 화면 동작이 그대로 유지됩니다.
 * 위치: src\pages\Analysis\data.ts
 */
import type { KpiItem } from "./components/KpiStrip";
import type { PlatformBarItem } from "./components/PlatformBars";
import type { CategoryBarItem } from "./components/CategoryBars";
import type { RepeatItem } from "./components/RepeatTop3";
import type { SubscriptionItem } from "./components/SubscriptionList";
import type { WeeklyDay } from "./components/WeeklyPattern";
import type {
  TxCategory,
  TxPlatform,
  TxRow,
} from "../Transactions/components/TransactionTable";
import { tokens } from "../../styles/tokens";
import { PLATFORM_LABELS, CATEGORY_LABELS } from "../../constants/labels";
import { getPrevMonthKey } from "../Transactions/data";

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

function toMonthKey(dateStr: string): string {
  const match = dateStr.match(/(\d{4})[./-](\d{1,2})/);
  if (!match) return "";
  const [, year, month] = match;
  return `${year}-${month.padStart(2, "0")}`;
}

function parseDate(dateStr: string): { year: number; month: number; day: number } | null {
  const match = dateStr.match(/(\d{4})[./-](\d{1,2})[./-](\d{1,2})/);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

function shiftMonthKey(monthKey: string, delta: number): string {
  const [yearStr, monthStr] = monthKey.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!year || !month) return monthKey;
  const totalMonths = year * 12 + (month - 1) + delta;
  const y = Math.floor(totalMonths / 12);
  const m = (totalMonths % 12) + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

function sumSpend(rows: TxRow[]): number {
  return rows
    .filter((row) => row.type === "expense" && row.status !== "cancel")
    .reduce((sum, row) => sum + Math.abs(row.amount), 0);
}

function countPurchase(rows: TxRow[]): number {
  return rows.filter((row) => row.type === "expense" && row.status !== "cancel").length;
}

function sumIncomeAndRefund(rows: TxRow[]): number {
  return rows
    .filter((row) => row.type === "income")
    .reduce((sum, row) => sum + Math.max(0, row.amount), 0);
}

function sumCancel(rows: TxRow[]): number {
  return rows
    .filter((row) => row.status === "cancel")
    .reduce((sum, row) => sum + Math.abs(row.amount), 0);
}

function buildPlatform(rows: TxRow[]): {
  items: PlatformBarItem[];
  totalSpend: number;
  totalIncome: number;
  netSpend: number;
} {
  const totals: Record<TxPlatform, { value: number; count: number }> = {
    coupang: { value: 0, count: 0 },
    naver: { value: 0, count: 0 },
    musinsa: { value: 0, count: 0 },
  };
  for (const row of rows) {
    if (row.type !== "expense" || row.status === "cancel") continue;
    totals[row.platform].value += Math.abs(row.amount);
    totals[row.platform].count += 1;
  }
  const totalSpend = Object.values(totals).reduce((sum, entry) => sum + entry.value, 0);
  const entries: Array<{ key: TxPlatform; label: string; color: string }> = [
    { key: "coupang", label: PLATFORM_LABELS.coupang, color: tokens.color.cat3 },
    { key: "naver", label: PLATFORM_LABELS.naver, color: tokens.color.cat2 },
    { key: "musinsa", label: PLATFORM_LABELS.musinsa, color: tokens.color.cat1 },
  ];
  const items: PlatformBarItem[] = entries.map((entry) => {
    const stats = totals[entry.key];
    const percent = totalSpend > 0 ? Math.round((stats.value / totalSpend) * 100) : 0;
    return {
      label: entry.label,
      value: stats.value,
      percent,
      count: stats.count,
      color: entry.color,
    };
  });
  const totalIncome = sumIncomeAndRefund(rows);
  return { items, totalSpend, totalIncome, netSpend: totalSpend - totalIncome };
}

const CATEGORY_COLOR: Record<TxCategory, string> = {
  living: tokens.color.cat2,
  fashion: tokens.color.cat1,
  digital: tokens.color.cat4,
  food: tokens.color.cat3,
  // "기타"는 의도적으로 중립적인 회색 계열 cat5를 씁니다 — 차트에서 다른 카테고리를 더 두드러지게 하기 위함입니다.
  etc: tokens.color.cat5,
};

function buildCategory(rows: TxRow[]): CategoryBarItem[] {
  const totals: Record<TxCategory, number> = {
    living: 0,
    fashion: 0,
    digital: 0,
    food: 0,
    etc: 0,
  };
  for (const row of rows) {
    if (row.type !== "expense" || row.status === "cancel") continue;
    totals[row.category] += Math.abs(row.amount);
  }
  const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
  const entries = (Object.entries(totals) as Array<[TxCategory, number]>)
    .map(([key, amount]) => ({
      label: CATEGORY_LABELS[key],
      amount,
      percent: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: CATEGORY_COLOR[key],
    }))
    .sort((a, b) => b.amount - a.amount);
  return entries;
}

function buildRepeat(rows: TxRow[]): RepeatItem[] {
  // 같은 상품을 여러 번 구매한 경향을 잡기 위해 제목을 키로 집계합니다.
  const byTitle = new Map<
    string,
    { title: string; platform: TxPlatform; category: TxCategory; count: number; amount: number }
  >();
  for (const row of rows) {
    if (row.type !== "expense" || row.status === "cancel") continue;
    const existing = byTitle.get(row.title);
    if (existing) {
      existing.count += 1;
      existing.amount += Math.abs(row.amount);
    } else {
      byTitle.set(row.title, {
        title: row.title,
        platform: row.platform,
        category: row.category,
        count: 1,
        amount: Math.abs(row.amount),
      });
    }
  }
  return Array.from(byTitle.values())
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.amount - a.amount;
    })
    .slice(0, 3)
    .map((entry, index) => ({
      rank: (index + 1) as 1 | 2 | 3,
      title: entry.title,
      platform: PLATFORM_LABELS[entry.platform],
      category: CATEGORY_LABELS[entry.category],
      count: entry.count,
      amount: entry.amount,
    }));
}

const SUB_COLOR: Record<string, string> = {
  넷플릭스: "#E11D48",
  "유튜브 프리미엄": "#E11D48",
  "쿠팡 와우 멤버십": "#FB923C",
  "네이버플러스 멤버십": tokens.color.cat2,
  "스포티파이 개인": "#22C55E",
  "밀리의 서재": tokens.color.cat4,
};

function buildSubscriptions(rows: TxRow[], monthKey: string): { items: SubscriptionItem[]; total: number } {
  const subs = rows.filter((row) => row.status === "sub");
  const byName = new Map<string, { name: string; amount: number; nextDate: string }>();
  for (const row of subs) {
    const parsed = parseDate(row.date);
    const nextDate = parsed ? `${parsed.month}.${parsed.day}` : "";
    const existing = byName.get(row.title);
    if (!existing) {
      byName.set(row.title, { name: row.title, amount: Math.abs(row.amount), nextDate });
    }
  }
  const items = Array.from(byName.values())
    .slice(0, 5)
    .map((sub, index) => ({
      id: `${monthKey}-sub-${index}`,
      name: sub.name,
      color: SUB_COLOR[sub.name] ?? tokens.color.accent,
      nextDate: sub.nextDate,
      amount: sub.amount,
    }));
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  return { items, total };
}

/** JavaScript getDay()는 일요일=0 이라서 월요일=0 기준으로 맞춰 줍니다. */
function weekdayIndex(dateStr: string): number {
  const parsed = parseDate(dateStr);
  if (!parsed) return 0;
  const d = new Date(parsed.year, parsed.month - 1, parsed.day);
  // JS: 일(0)~토(6) → 우리 순서 월(0)~일(6)
  return (d.getDay() + 6) % 7;
}

function buildWeekly(rows: TxRow[]): { days: WeeklyDay[]; note: string } {
  const buckets = [0, 0, 0, 0, 0, 0, 0];
  for (const row of rows) {
    if (row.type !== "expense" || row.status === "cancel") continue;
    buckets[weekdayIndex(row.date)] += Math.abs(row.amount);
  }
  const total = buckets.reduce((sum, v) => sum + v, 0);
  const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
  // 상위 2개 요일에 강조를 부여해서 "피크 요일"을 한눈에 보이게 합니다.
  const sortedIdx = [...buckets.keys()].sort((a, b) => buckets[b] - buckets[a]);
  const emphasizeSet = new Set(sortedIdx.slice(0, 2));
  const days: WeeklyDay[] = buckets.map((amount, index) => ({
    day: DAY_LABELS[index],
    amount,
    ...(amount > 0 && emphasizeSet.has(index) ? { emphasize: true } : {}),
  }));
  const weekendSum = buckets[4] + buckets[5] + buckets[6];
  const weekendShare = total > 0 ? Math.round((weekendSum / total) * 100) : 0;
  const note =
    total === 0
      ? "요일별 지출을 확인할 거래가 아직 없어요."
      : weekendShare >= 50
        ? `금·토·일에 전체의 **${weekendShare}%**가 집중돼요. 주말 쇼핑 한도를 정하면 지출 조절에 도움이 돼요.`
        : `평일 쪽 지출이 **${100 - weekendShare}%**로 더 많아요. 주말 쇼핑을 의식적으로 덜 하는 흐름이에요.`;
  return { days, note };
}

function buildKpis(
  thisMonth: TxRow[],
  prevMonth: TxRow[]
): KpiItem[] {
  const totalSpend = sumSpend(thisMonth);
  const prevSpend = sumSpend(prevMonth);
  const count = countPurchase(thisMonth);
  const prevCount = countPurchase(prevMonth);
  const avg = count > 0 ? Math.round(totalSpend / count) : 0;
  const prevAvg = prevCount > 0 ? Math.round(prevSpend / prevCount) : 0;
  const refundPlusCancel = sumIncomeAndRefund(thisMonth) + sumCancel(thisMonth);
  const refundCount = thisMonth.filter((row) => row.status === "refund").length;
  const cancelCount = thisMonth.filter((row) => row.status === "cancel").length;

  const spendPct = prevSpend > 0 ? ((totalSpend - prevSpend) / prevSpend) * 100 : 0;
  const avgPct = prevAvg > 0 ? ((avg - prevAvg) / prevAvg) * 100 : 0;

  const fmtPct = (pct: number) => {
    const rounded = Math.round(pct * 10) / 10;
    const sign = rounded >= 0 ? "+" : "−";
    return `${sign}${Math.abs(rounded).toFixed(1)}%`;
  };

  return [
    {
      key: "spend",
      label: "총 지출",
      value: totalSpend,
      ...(prevSpend > 0
        ? { delta: { tone: spendPct >= 0 ? "up" : "down", text: fmtPct(spendPct) } }
        : {}),
    },
    {
      key: "count",
      label: "쇼핑 횟수",
      value: count,
      unit: "건",
      sub: prevCount > 0 ? `지난달 ${prevCount}건` : "주간 평균 수준",
    },
    {
      key: "avg",
      label: "평균 주문금액",
      value: avg,
      ...(prevAvg > 0
        ? { delta: { tone: avgPct >= 0 ? "up" : "down", text: fmtPct(avgPct) } }
        : {}),
    },
    {
      key: "refund",
      label: "환불·취소",
      value: refundPlusCancel,
      sub:
        refundCount + cancelCount === 0
          ? "내역 없음"
          : `환불 ${refundCount}건${cancelCount > 0 ? `, 취소 ${cancelCount}건` : ""}`,
      valueColor: tokens.color.neg,
    },
  ];
}

function buildTrend(rows: TxRow[], monthKey: string) {
  // 최근 6개월만 보여 분석 화면의 막대 라인이 과밀해지지 않도록 합니다.
  const points = [] as { label: string; value: number }[];
  const values: number[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const key = shiftMonthKey(monthKey, -i);
    const spend = sumSpend(rows.filter((row) => toMonthKey(row.date) === key));
    const month = Number(key.split("-")[1] ?? 0);
    points.push({ label: month > 0 ? `${month}월` : key, value: spend });
    values.push(spend);
  }
  const nonZero = values.filter((value) => value > 0);
  const average =
    nonZero.length > 0 ? Math.round(nonZero.reduce((sum, v) => sum + v, 0) / nonZero.length) : 0;
  return { points, average };
}

function buildSummary(
  thisMonth: TxRow[],
  prevMonth: TxRow[],
  category: CategoryBarItem[],
  platform: { items: PlatformBarItem[]; totalSpend: number }
): string {
  const totalSpend = sumSpend(thisMonth);
  if (totalSpend === 0) {
    return "이번 달은 아직 집계할 지출이 없어요. 거래를 입력하면 요약이 채워져요.";
  }
  const prevSpend = sumSpend(prevMonth);
  const deltaText =
    prevSpend > 0
      ? `지난달 대비 **지출은 ${totalSpend >= prevSpend ? "+" : "−"}${Math.abs(
          Math.round(((totalSpend - prevSpend) / prevSpend) * 1000) / 10,
        ).toFixed(1)}%** ${totalSpend >= prevSpend ? "증가" : "감소"}했어요.`
      : "이번 달이 첫 집계라 비교 기준은 아직 없어요.";
  const topCategory = category[0];
  const topPlatform = [...platform.items].sort((a, b) => b.value - a.value)[0];
  const parts: string[] = [];
  if (topCategory && topCategory.percent > 0) {
    parts.push(`**${topCategory.label}(${topCategory.percent}%)**가 가장 많이 쓰고 있고`);
  }
  if (topPlatform && topPlatform.percent > 0) {
    parts.push(`**${topPlatform.label}** 비중이 가장 높아요`);
  }
  const composition = parts.length > 0 ? `${parts.join(", ")}. ` : "";
  return `이번 달은 ${composition}${deltaText}`;
}

export const buildAnalysisData = (rows: TxRow[], monthKey: string): AnalysisMockData => {
  const thisMonth = rows.filter((row) => toMonthKey(row.date) === monthKey);
  const prevMonth = rows.filter((row) => toMonthKey(row.date) === getPrevMonthKey(monthKey));

  const platform = buildPlatform(thisMonth);
  const category = buildCategory(thisMonth);
  const repeat = buildRepeat(thisMonth);
  const { items: subscriptions, total: subscriptionTotal } = buildSubscriptions(thisMonth, monthKey);
  const trend = buildTrend(rows, monthKey);
  const weekly = buildWeekly(thisMonth);
  const kpis = buildKpis(thisMonth, prevMonth);
  const summary = buildSummary(thisMonth, prevMonth, category, platform);

  return {
    summary,
    kpis,
    platform,
    category,
    repeat,
    subscriptions,
    subscriptionTotal,
    trend,
    weekly,
  };
};
