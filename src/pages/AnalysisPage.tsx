import styled from "styled-components";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "../components/layout/AppShell";
import { Card, CardHeader } from "../components/primitives/Card";

const KPI_ITEMS = [
  { label: "총 지출", value: "₩463,500", sub: "전월 대비 +8.2%", subColor: "#D92626" },
  { label: "쇼핑 횟수", value: "12건", sub: "이번 달 누적", subColor: "#6B7280" },
  { label: "평균 주문금액", value: "₩38,625", sub: "전월 대비 +12%", subColor: "#D92626" },
  { label: "환불·취소", value: "₩189,000", sub: "이번 달 1건 (취소)", subColor: "#E58C1A", highlight: true },
];

const PLATFORM_SPENDING = [
  { label: "쿠팡", amount: 245000, percent: 53, color: "#FF4B00" },
  { label: "네이버", amount: 158000, percent: 34, color: "#03C75A" },
  { label: "무신사", amount: 60500, percent: 13, color: "#6C63FF" },
];

const CATEGORY_SPENDING = [
  { label: "패션/의류", percent: 47, color: "#4F6EF7" },
  { label: "전자기기", percent: 41, color: "#8B5CF6" },
  { label: "생활용품", percent: 7, color: "#10B981" },
  { label: "식품/음료", percent: 4, color: "#F59E0B" },
];

const REPEATS = [
  {
    rank: 1,
    name: "진라면 매운맛 40개입",
    meta: "쿠팡 · 식품/음료",
    count: "3회",
    amount: "₩55,500",
    color: "#10B981",
  },
  {
    rank: 2,
    name: "스타벅스 아메리카노 원두 1kg",
    meta: "네이버쇼핑 · 식품/음료",
    count: "2회",
    amount: "₩70,000",
    color: "#4F6EF7",
  },
  {
    rank: 3,
    name: "헤드앤숄더 샴푸 400ml",
    meta: "쿠팡 · 생활용품",
    count: "2회",
    amount: "₩26,000",
    color: "#F59E0B",
  },
];

const SUBSCRIPTIONS = [
  { service: "넷플릭스", next: "다음 결제 4.20", amount: "₩13,900/월", color: "#EF4444" },
  { service: "유튜브 프리미엄", next: "다음 결제 4.25", amount: "₩14,900/월", color: "#EF4444" },
  { service: "멜론", next: "다음 결제 5.01", amount: "₩10,900/월", color: "#EF4444" },
];

const MONTHLY_TREND = [
  { month: "11월", amount: 380000 },
  { month: "12월", amount: 520000 },
  { month: "1월", amount: 410000 },
  { month: "2월", amount: 490000 },
  { month: "3월", amount: 612000 },
  { month: "4월", amount: 463500 },
];

const KpiRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const KpiCard = styled(Card)<{ $highlight?: boolean }>`
  padding: 20px;

  .label {
    font-size: 12px;
    color: #6b7280;
  }

  .value {
    font-size: 26px;
    font-weight: 700;
    margin: 4px 0;
    color: ${({ $highlight }) => ($highlight ? "#E58C1A" : "#111827")};
  }

  .sub {
    font-size: 12px;
    font-weight: 500;
  }
`;

const ChartRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const PlatformList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PlatformItem = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 12px;
  align-items: center;
`;

const PlatformLabel = styled.div`
  font-size: 13px;
  color: #374151;
  font-weight: 500;
`;

const BarTrack = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #eef2f7;
  overflow: hidden;
`;

const BarFill = styled.div<{ $color: string; $width: number }>`
  width: ${({ $width }) => `${$width}%`};
  height: 100%;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

const PlatformValue = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #111827;
  min-width: 100px;
  text-align: right;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
`;

const SumRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
`;

const SumLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const SumValue = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CategoryItem = styled.div`
  display: grid;
  grid-template-columns: 96px 1fr 40px;
  gap: 12px;
  align-items: center;
`;

const CategoryLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #374151;
`;

const ColorDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const PercentValue = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #111827;
  text-align: right;
`;

const SmallBadge = styled.span<{ $variant?: "default" | "green" }>`
  background: ${({ $variant }) => ($variant === "green" ? "#D1FAE5" : "#EDF2FF")};
  color: ${({ $variant }) => ($variant === "green" ? "#059669" : "#3E76FC")};
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 8px;
  white-space: nowrap;
`;

const RepeatList = styled.div`
  display: flex;
  flex-direction: column;
`;

const RepeatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const RankCircle = styled.div<{ $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background: ${({ $color }) => $color};
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ItemBody = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
  }

  .meta {
    font-size: 11px;
    color: #6b7280;
  }
`;

const Trailing = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-shrink: 0;

  .count {
    font-size: 11px;
    font-weight: 700;
    color: #4f6ef7;
  }

  .amount {
    font-size: 13px;
    font-weight: 700;
    color: #111827;
  }
`;

const SubscriptionList = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubscriptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const ServiceIcon = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const ServiceBody = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
  }

  .meta {
    font-size: 11px;
    color: #6b7280;
  }
`;

const ServiceAmount = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  flex-shrink: 0;
`;

const InsightBanner = styled(Card)`
  padding: 20px;
  background: #fffce8;
`;

const InsightLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
`;

const InsightText = styled.div`
  font-size: 12px;
  color: #4b5563;
  line-height: 1.6;
`;

const AvgBlock = styled.div`
  font-size: 12px;
  color: #6b7280;

  strong {
    color: #111827;
  }
`;

const TrendArea = styled.div`
  width: 100%;
  height: 260px;
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
`;

const SummaryRow = ({
  label,
  value,
  valueColor,
  bold,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
}) => (
  <SumRow>
    <SumLabel>{label}</SumLabel>
    <SumValue style={{ color: valueColor, fontWeight: bold ? 700 : 600 }}>
      {value}
    </SumValue>
  </SumRow>
);

const TrendTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: (typeof MONTHLY_TREND)[number] }>;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <TooltipBox>
      <div className="label">{payload[0].payload.month}</div>
      <div className="value">₩{payload[0].value.toLocaleString("ko-KR")}</div>
    </TooltipBox>
  );
};

export const AnalysisPage = () => {
  return (
    <AppShell activeNav="analysis" title="소비 분석">
      <KpiRow>
        {KPI_ITEMS.map((item) => (
          <KpiCard key={item.label} padding={20} $highlight={item.highlight}>
            <div className="label">{item.label}</div>
            <div className="value">{item.value}</div>
            <div className="sub" style={{ color: item.subColor }}>
              {item.sub}
            </div>
          </KpiCard>
        ))}
      </KpiRow>

      <ChartRow>
        <Card padding={24}>
          <CardHeader title="플랫폼별 지출" />
          <PlatformList>
            {PLATFORM_SPENDING.map((item) => (
              <PlatformItem key={item.label}>
                <PlatformLabel>{item.label}</PlatformLabel>
                <BarTrack>
                  <BarFill $color={item.color} $width={item.percent} />
                </BarTrack>
                <PlatformValue>
                  ₩{item.amount.toLocaleString("ko-KR")} ({item.percent}%)
                </PlatformValue>
              </PlatformItem>
            ))}
          </PlatformList>

          <Divider style={{ margin: "16px 0" }} />
          <SummaryRow label="이번 달 총 지출" value="₩463,500" />
          <SummaryRow label="이번 달 총 수입" value="+₩85,000" valueColor="#3E76FC" />
          <Divider style={{ margin: "12px 0" }} />
          <SummaryRow
            label="순 지출 (지출 - 수입)"
            value="₩378,500"
            valueColor="#D92626"
            bold
          />
        </Card>

        <Card padding={24}>
          <CardHeader title="카테고리별 지출" />
          <CategoryList>
            {CATEGORY_SPENDING.map((item) => (
              <CategoryItem key={item.label}>
                <CategoryLabel>
                  <ColorDot $color={item.color} />
                  {item.label}
                </CategoryLabel>
                <BarTrack>
                  <BarFill $color={item.color} $width={item.percent} />
                </BarTrack>
                <PercentValue>{item.percent}%</PercentValue>
              </CategoryItem>
            ))}
          </CategoryList>
        </Card>
      </ChartRow>

      <ChartRow>
        <Card padding={24}>
          <CardHeader
            title="반복 구매 TOP 3"
            right={<SmallBadge>이번 달 3회 이상 구매</SmallBadge>}
          />
          <RepeatList>
            {REPEATS.map((item) => (
              <RepeatItem key={item.rank}>
                <RankCircle $color={item.color}>{item.rank}</RankCircle>
                <ItemBody>
                  <div className="name">{item.name}</div>
                  <div className="meta">{item.meta}</div>
                </ItemBody>
                <Trailing>
                  <span className="count">{item.count}</span>
                  <span className="amount">{item.amount}</span>
                </Trailing>
              </RepeatItem>
            ))}
          </RepeatList>
        </Card>

        <Card padding={24}>
          <CardHeader
            title="정기결제 감지"
            right={<SmallBadge $variant="green">자동 감지됨</SmallBadge>}
          />
          <SubscriptionList>
            {SUBSCRIPTIONS.map((item) => (
              <SubscriptionItem key={item.service}>
                <ServiceIcon $color={item.color} />
                <ServiceBody>
                  <div className="name">{item.service}</div>
                  <div className="meta">{item.next}</div>
                </ServiceBody>
                <ServiceAmount>{item.amount}</ServiceAmount>
              </SubscriptionItem>
            ))}
          </SubscriptionList>
          <Divider style={{ margin: "16px 0" }} />
          <SummaryRow label="이번 달 정기결제 합계" value="₩39,700/월" bold />
        </Card>
      </ChartRow>

      <InsightBanner padding={20}>
        <InsightLabel>이번 달 소비 요약</InsightLabel>
        <InsightText>
          취소 건을 제외한 실 지출은 ₩274,500이에요. 패션/의류(47%)에 가장 많이
          쓰고 있고, 쿠팡 비중이 절반 이상이에요.
        </InsightText>
      </InsightBanner>

      <Card padding={24} style={{ marginTop: 16 }}>
        <CardHeader
          title="월별 소비 추이"
          subtitle="최근 6개월간 결제금액 추이"
          right={
            <AvgBlock>
              최근 6개월 평균 <strong>₩623,917/월</strong>
            </AvgBlock>
          }
        />
        <TrendArea>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_TREND} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="analysisTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F6EF7" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#4F6EF7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
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
                tickFormatter={(value: number) => `${Math.round(value / 10000)}만`}
              />
              <Tooltip content={<TrendTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#4F6EF7"
                strokeWidth={2.5}
                fill="url(#analysisTrendFill)"
                dot={{ fill: "#4F6EF7", r: 4 }}
                activeDot={{ r: 6, fill: "#4F6EF7", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </TrendArea>
      </Card>
    </AppShell>
  );
};
