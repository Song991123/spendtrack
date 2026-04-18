import styled from "styled-components";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AppShell } from "../components/layout/AppShell";
import type { NavKey } from "../components/layout/AppShell";
import { formatKRW } from "../utils/format";

interface AnalysisPageProps {
  activeNav: NavKey;
  onNavChange: (key: NavKey) => void;
}

interface PlatformData {
  name: string;
  amount: number;
  percent: number;
  color: string;
}

const PLATFORM_DATA: PlatformData[] = [
  { name: "쿠팡", amount: 245000, percent: 53, color: "#F59E0B" },
  { name: "네이버쇼핑", amount: 158000, percent: 34, color: "#10B981" },
  { name: "무신사", amount: 60500, percent: 13, color: "#8B5CF6" },
];

const PLATFORM_TOTAL = PLATFORM_DATA.reduce((s, p) => s + p.amount, 0);

interface CategoryData {
  name: string;
  amount: number;
  percent: number;
  color: string;
}

const CATEGORY_DATA: CategoryData[] = [
  { name: "패션/의류", amount: 217845, percent: 47, color: "#3B82F6" },
  { name: "전자기기", amount: 190035, percent: 41, color: "#8B5CF6" },
  { name: "생활용품", amount: 32445, percent: 7, color: "#10B981" },
  { name: "식품/음료", amount: 18540, percent: 4, color: "#F59E0B" },
];

interface MonthlyTrendPoint {
  month: string;
  amount: number;
}

const MONTHLY_TREND: MonthlyTrendPoint[] = [
  { month: "11월", amount: 380000 },
  { month: "12월", amount: 520000 },
  { month: "1월", amount: 410000 },
  { month: "2월", amount: 490000 },
  { month: "3월", amount: 612000 },
  { month: "4월", amount: 463500 },
];

interface RepeatProduct {
  rank: 1 | 2 | 3;
  name: string;
  meta: string;
  count: number;
  amount: number;
}

const REPEATS: RepeatProduct[] = [
  {
    rank: 1,
    name: "진라면 매운맛 40개입",
    meta: "쿠팡 · 식품/음료",
    count: 3,
    amount: 55500,
  },
  {
    rank: 2,
    name: "스타벅스 아메리카노 원두 1kg",
    meta: "네이버쇼핑 · 식품/음료",
    count: 2,
    amount: 70000,
  },
  {
    rank: 3,
    name: "헤드앤숄더 샴푸 400ml",
    meta: "쿠팡 · 생활용품",
    count: 2,
    amount: 26000,
  },
];

const RANK_COLORS: Record<1 | 2 | 3, string> = {
  1: "#F59E0B",
  2: "#3B82F6",
  3: "#10B981",
};

interface Subscription {
  id: string;
  service: string;
  nextDate: string;
  monthly: number;
  color: string;
}

const SUBSCRIPTIONS: Subscription[] = [
  {
    id: "s1",
    service: "넷플릭스",
    nextDate: "다음 결제 4.20",
    monthly: 13900,
    color: "#EF4444",
  },
  {
    id: "s2",
    service: "유튜브 프리미엄",
    nextDate: "다음 결제 4.25",
    monthly: 14900,
    color: "#EF4444",
  },
  {
    id: "s3",
    service: "멜론",
    nextDate: "다음 결제 5.01",
    monthly: 10900,
    color: "#10B981",
  },
];

const SUB_TOTAL = SUBSCRIPTIONS.reduce((sum, s) => sum + s.monthly, 0);

const AI_INSIGHT =
  "이번 달 패션/의류 지출이 전월 대비 증가했어요. 쿠팡 반복 구매가 많으니 구독 혜택을 확인해 보세요. 카테고리별 예산을 설정하면 다음 달 소비를 더 효율적으로 관리할 수 있어요.";

const Spacer = styled.div<{ $h?: number }>`
  height: ${({ $h = 8 }) => $h}px;
`;

const CardBox = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.02);
`;

const CardHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  gap: 12px;

  .titles {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  h3 {
    margin: 0;
    font-size: 14.5px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.15px;
  }
  .subtitle {
    font-size: 11.5px;
    color: #9ca3af;
    font-weight: 400;
  }
`;

const Badge = styled.span<{ $tone?: "info" | "success" }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  background: ${({ $tone }) =>
    $tone === "success" ? "#d1fae5" : "#eef2ff"};
  color: ${({ $tone }) => ($tone === "success" ? "#0f9b54" : "#4f6ef7")};
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  align-items: stretch;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const TrendArea = styled.div`
  width: 100%;
  height: 240px;
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
  width: 180px;
  height: 180px;
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
    font-size: 11px;
    color: #9ca3af;
    font-weight: 500;
  }
  .value {
    font-size: 16px;
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
    min-width: 72px;
    text-align: right;
  }
`;

const BarArea = styled.div`
  width: 100%;
  height: 220px;
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

const TotalLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid #e5e7eb;

  .label {
    font-size: 12px;
    color: #6b7280;
  }
  .value {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.2px;
  }
`;

const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const RepeatItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const Rank = styled.div<{ $color: string }>`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background: ${({ $color }) => $color};
  color: #ffffff;
  font-weight: 700;
  font-size: 11.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ItemBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;

  .name {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .meta {
    font-size: 11px;
    color: #6b7280;
  }
`;

const RepeatTrailing = styled.div`
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-shrink: 0;

  .count {
    font-size: 11.5px;
    font-weight: 700;
    color: #4f6ef7;
  }
  .amount {
    font-size: 13px;
    font-weight: 700;
    color: #111827;
  }
`;

const SubItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const SubIcon = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const SubAmount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  flex-shrink: 0;
`;

const AICard = styled.div`
  padding: 18px 22px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .head {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .icon {
    font-size: 16px;
    color: #4338ca;
  }
  .label {
    font-size: 13px;
    font-weight: 700;
    color: #4338ca;
    letter-spacing: -0.1px;
  }
  .text {
    font-size: 12.5px;
    color: #374151;
    line-height: 1.65;
  }
`;

interface TrendTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: MonthlyTrendPoint }>;
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

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: PlatformData }>;
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

interface CategoryTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CategoryData }>;
}

const CategoryTooltip = ({ active, payload }: CategoryTooltipProps) => {
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

export const AnalysisPage = ({
  activeNav,
  onNavChange,
}: AnalysisPageProps) => {
  return (
    <AppShell
      activeNav={activeNav}
      title="소비분석"
      onNavChange={onNavChange}
    >
      <CardBox>
        <CardHead>
          <div className="titles">
            <h3>월별 소비 추이</h3>
            <span className="subtitle">최근 6개월간 결제금액 추이</span>
          </div>
          <Badge>최근 6개월</Badge>
        </CardHead>
        <TrendArea>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={MONTHLY_TREND}
              margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
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
                tick={{ fill: "#9ca3af", fontSize: 12 }}
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
                fill="url(#trendGrad)"
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
      </CardBox>

      <Spacer $h={4} />

      <TwoCol>
        <CardBox>
          <CardHead>
            <div className="titles">
              <h3>플랫폼별 지출</h3>
              <span className="subtitle">이번 달 기준</span>
            </div>
          </CardHead>
          <PieWrap>
            <PieArea>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PLATFORM_DATA}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    animationDuration={800}
                  >
                    {PLATFORM_DATA.map((p) => (
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
                <div className="label">총 지출</div>
                <div className="value">{formatKRW(PLATFORM_TOTAL)}</div>
              </PieCenter>
            </PieArea>

            <PieLegend>
              {PLATFORM_DATA.map((p) => (
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
        </CardBox>

        <CardBox>
          <CardHead>
            <div className="titles">
              <h3>카테고리별 지출</h3>
              <span className="subtitle">이번 달 기준</span>
            </div>
          </CardHead>
          <BarArea>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={CATEGORY_DATA}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                  domain={[0, 100]}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#374151", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={72}
                />
                <Tooltip
                  content={<CategoryTooltip />}
                  cursor={{ fill: "#f9fafb" }}
                />
                <Bar
                  dataKey="percent"
                  radius={[0, 6, 6, 0]}
                  animationDuration={800}
                  barSize={18}
                >
                  {CATEGORY_DATA.map((c) => (
                    <Cell key={c.name} fill={c.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </BarArea>
        </CardBox>
      </TwoCol>

      <Spacer $h={4} />

      <TwoCol>
        <CardBox>
          <CardHead>
            <div className="titles">
              <h3>반복 구매 TOP 3</h3>
              <span className="subtitle">자주 구매한 상품 순위</span>
            </div>
            <Badge>이번 달 3회 이상 구매</Badge>
          </CardHead>
          <ItemList>
            {REPEATS.map((r) => (
              <RepeatItem key={r.rank}>
                <Rank $color={RANK_COLORS[r.rank]}>{r.rank}</Rank>
                <ItemBody>
                  <span className="name">{r.name}</span>
                  <span className="meta">{r.meta}</span>
                </ItemBody>
                <RepeatTrailing>
                  <span className="count">{r.count}회</span>
                  <span className="amount">{formatKRW(r.amount)}</span>
                </RepeatTrailing>
              </RepeatItem>
            ))}
          </ItemList>
        </CardBox>

        <CardBox>
          <CardHead>
            <div className="titles">
              <h3>정기결제 감지</h3>
              <span className="subtitle">자동으로 인식된 구독</span>
            </div>
            <Badge $tone="success">자동 감지됨</Badge>
          </CardHead>
          <ItemList>
            {SUBSCRIPTIONS.map((s) => (
              <SubItem key={s.id}>
                <SubIcon $color={s.color} />
                <ItemBody>
                  <span className="name">{s.service}</span>
                  <span className="meta">{s.nextDate}</span>
                </ItemBody>
                <SubAmount>{formatKRW(s.monthly)}/월</SubAmount>
              </SubItem>
            ))}
          </ItemList>
          <TotalLine>
            <span className="label">이번 달 정기결제 합계</span>
            <span className="value">{formatKRW(SUB_TOTAL)}/월</span>
          </TotalLine>
        </CardBox>
      </TwoCol>

      <Spacer $h={4} />

      <AICard>
        <div className="head">
          <span className="icon">✦</span>
          <span className="label">AI 소비 패턴 인사이트</span>
        </div>
        <span className="text">{AI_INSIGHT}</span>
      </AICard>
    </AppShell>
  );
};