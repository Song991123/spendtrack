import styled from "styled-components";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AppShell } from "../components/layout/AppShell";
import { Card, CardHeader } from "../components/primitives/Card";
import { Grid } from "../components/primitives/Layout";
import { StatCard } from "../components/display/StatCard";
import TransactionRow from "../components/list/TransactionRow";
import { PLATFORM_COLORS } from "../tokens/platforms";
import type { NavKey } from "../components/layout/AppShell";
import { formatKRW } from "../utils/format";

interface HomePageProps {
  activeNav: NavKey;
  onNavChange: (key: NavKey) => void;
}

interface PlatformShare {
  name: string;
  amount: number;
  percent: number;
  color: string;
}

const PLATFORM_SHARE: PlatformShare[] = [
  {
    name: "쿠팡",
    amount: 342500,
    percent: 40,
    color: PLATFORM_COLORS["쿠팡"].dot,
  },
  {
    name: "네이버쇼핑",
    amount: 285000,
    percent: 34,
    color: PLATFORM_COLORS["네이버쇼핑"].dot,
  },
  {
    name: "무신사",
    amount: 219700,
    percent: 26,
    color: PLATFORM_COLORS["무신사"].dot,
  },
];

const TOTAL_AMOUNT = PLATFORM_SHARE.reduce((s, p) => s + p.amount, 0);

interface TrendPoint {
  month: string;
  amount: number;
}

const TREND_DATA: TrendPoint[] = [
  { month: "11월", amount: 580000 },
  { month: "12월", amount: 720000 },
  { month: "1월", amount: 510000 },
  { month: "2월", amount: 690000 },
  { month: "3월", amount: 780000 },
  { month: "4월", amount: TOTAL_AMOUNT },
];

const TREND_AVG = Math.round(
  TREND_DATA.reduce((s, t) => s + t.amount, 0) / TREND_DATA.length
);

const TXS = [
  {
    id: "1",
    productName: "나이키 에어포스 1 로우",
    platform: "쿠팡",
    category: "패션",
    amount: 129000,
    purchasedAt: "2025-04-14",
  },
  {
    id: "2",
    productName: "삼성 버즈2 프로 이어폰",
    platform: "네이버쇼핑",
    category: "디지털",
    amount: 189000,
    purchasedAt: "2025-04-13",
  },
  {
    id: "3",
    productName: "앤더슨벨 오버핏 셔츠",
    platform: "무신사",
    category: "패션",
    amount: 89000,
    purchasedAt: "2025-04-10",
  },
] as const;

type InsightTone = "info" | "success" | "warn";

const INSIGHTS: { tone: InsightTone; title: string; desc: string }[] = [
  {
    tone: "info",
    title: "📊 이번달 쿠팡 지출이 평소보다 23% 높아요",
    desc: "최근 3개월 평균은 ₩278,000이에요.\n이번달은 ₩342,500 지출했어요.",
  },
  {
    tone: "success",
    title: "🎁 정기구매로 보이는 상품이 있어요",
    desc: "네이버쇼핑에서 매달 구매하는 상품이 2개 감지됐어요.\n정기품목으로 등록할까요?",
  },
  {
    tone: "warn",
    title: "🛍 패션 카테고리 비중이 높아요",
    desc: "전체 소비의 52%가 패션/의류예요.\n지난달 대비 패션 지출이 ₩46,000 증가했어요.",
  },
];

const Spacer = styled.div<{ $h?: number }>`
  height: ${({ $h = 8 }) => $h}px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.2px;
`;

const PieWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 540px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PieArea = styled.div`
  width: 160px;
  height: 160px;
  position: relative;
  flex-shrink: 0;

  @media (max-width: 540px) {
    align-self: center;
  }
`;

const PieCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;

  .label {
    font-size: 10.5px;
    color: #9ca3af;
    font-weight: 500;
  }
  .value {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.3px;
    margin-top: 2px;
  }
`;

const PieLegend = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    flex-shrink: 0;
  }
  .name {
    flex: 1;
    font-size: 12.5px;
    color: #374151;
    font-weight: 500;
  }
  .pct {
    font-size: 12px;
    font-weight: 700;
    min-width: 32px;
    text-align: right;
  }
  .amt {
    font-size: 11px;
    color: #9ca3af;
    min-width: 70px;
    text-align: right;
  }
`;

const TrendArea = styled.div`
  width: 100%;
  height: 200px;
`;

const TrendBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid #f3f4f6;

  .label {
    font-size: 11.5px;
    color: #6b7280;
  }
  .value {
    font-size: 13px;
    font-weight: 700;
    color: #111827;
  }
`;

const TooltipBox = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-size: 12px;

  .label {
    color: #6b7280;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .value {
    color: #111827;
    font-weight: 700;
  }
  .hint {
    color: #9ca3af;
    font-size: 11px;
    margin-top: 3px;
  }
`;

const TxListInner = styled.div`
  padding: 0 20px;
`;

const LinkBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: #4f6ef7;
  cursor: pointer;
  transition: opacity 0.12s;

  &:hover {
    opacity: 0.75;
  }
`;

const TONE_BG: Record<InsightTone, string> = {
  info: "#eef2ff",
  success: "#ecfdf5",
  warn: "#fffbeb",
};
const TONE_ACCENT: Record<InsightTone, string> = {
  info: "#c7d2fe",
  success: "#a7f3d0",
  warn: "#fde68a",
};

const InsightCard = styled.div<{ $tone: InsightTone }>`
  padding: 18px 20px;
  border-radius: 14px;
  background: ${({ $tone }) => TONE_BG[$tone]};
  border: 1px solid ${({ $tone }) => TONE_ACCENT[$tone]};
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.12s;

  &:hover {
    transform: translateY(-1px);
  }

  .title {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    line-height: 1.4;
  }
  .desc {
    font-size: 12px;
    color: #374151;
    line-height: 1.65;
    white-space: pre-line;
  }
`;

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: PlatformShare }>;
}

const PieTooltip = ({ active, payload }: PieTooltipProps) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <TooltipBox>
        <div className="label">{d.name}</div>
        <div className="value">{formatKRW(d.amount)}</div>
        <div className="hint">전체의 {d.percent}%</div>
      </TooltipBox>
    );
  }
  return null;
};

interface TrendTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: TrendPoint }>;
}

const TrendTooltip = ({ active, payload }: TrendTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <TooltipBox>
        <div className="label">{payload[0].payload.month}</div>
        <div className="value">{formatKRW(payload[0].value)}</div>
      </TooltipBox>
    );
  }
  return null;
};

export const HomePage = ({ activeNav, onNavChange }: HomePageProps) => (
  <AppShell
    activeNav={activeNav}
    onNavChange={onNavChange}
    title="대시보드"
    headerRight="2025년 4월 15일 화요일"
  >
    <Grid columns="repeat(3, 1fr)" gap={14}>
      <StatCard
        label="총 지출"
        value={formatKRW(TOTAL_AMOUNT)}
        trend={{ delta: 12 }}
      />
      <StatCard
        label="가장 많이 쓴 플랫폼"
        value="쿠팡"
        dot={{ color: PLATFORM_COLORS["쿠팡"].dot }}
        footer={`${formatKRW(342500)} · 전체의 40%`}
      />
      <StatCard
        label="이번달 주문 수"
        value="12건"
        footer="지난달 9건 대비 +3건"
      />
    </Grid>

    <Spacer $h={6} />

    <Grid columns="1fr 1fr" gap={14}>
      <Card>
        <CardHeader title="이번달 소비 요약" subtitle="플랫폼별 비율" />
        <PieWrap>
          <PieArea>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PLATFORM_SHARE}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={70}
                  paddingAngle={2}
                  animationDuration={800}
                >
                  {PLATFORM_SHARE.map((p) => (
                    <Cell
                      key={p.name}
                      fill={p.color}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <PieCenter>
              <div className="label">총 소비</div>
              <div className="value">{formatKRW(TOTAL_AMOUNT)}</div>
            </PieCenter>
          </PieArea>

          <PieLegend>
            {PLATFORM_SHARE.map((p) => (
              <LegendRow key={p.name}>
                <span className="dot" style={{ background: p.color }} />
                <span className="name">{p.name}</span>
                <span className="pct" style={{ color: p.color }}>
                  {p.percent}%
                </span>
                <span className="amt">{formatKRW(p.amount)}</span>
              </LegendRow>
            ))}
          </PieLegend>
        </PieWrap>
      </Card>

      <Card>
        <CardHeader title="최근 소비 추이" subtitle="최근 6개월 지출" />
        <TrendArea>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={TREND_DATA}
              margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="homeTrendGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#4f6ef7" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#4f6ef7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) =>
                  `${(v / 10000).toFixed(0)}만`
                }
              />
              <Tooltip content={<TrendTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#4f6ef7"
                strokeWidth={2.5}
                fill="url(#homeTrendGrad)"
                dot={{ fill: "#4f6ef7", r: 4 }}
                activeDot={{
                  r: 6,
                  fill: "#4f6ef7",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </TrendArea>
        <TrendBottom>
          <span className="label">최근 6개월 평균</span>
          <span className="value">{formatKRW(TREND_AVG)}/월</span>
        </TrendBottom>
      </Card>
    </Grid>

    <Spacer $h={6} />

    <Card padding="20px 0">
      <TxListInner>
        <CardHeader
          title="최근 소비"
          right={<LinkBtn type="button">전체보기 →</LinkBtn>}
        />
        {TXS.map((tx) => (
          <TransactionRow key={tx.id} item={tx} />
        ))}
      </TxListInner>
    </Card>

    <Spacer $h={6} />

    <Section>
      <SectionTitle>소비 인사이트</SectionTitle>
      <Grid columns="repeat(3, 1fr)" gap={14}>
        {INSIGHTS.map((ins, i) => (
          <InsightCard key={i} $tone={ins.tone}>
            <span className="title">{ins.title}</span>
            <span className="desc">{ins.desc}</span>
          </InsightCard>
        ))}
      </Grid>
    </Section>
  </AppShell>
);