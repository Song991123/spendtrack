import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "../components/layout/AppShell";
import { Card, CardHeader } from "../components/primitives/Card";
import { mockTransactions } from "../data/mockTransactions";
import {
  formatAmount,
  platformColor,
  platformInitial,
  platformLabel,
} from "../utils/transaction";

const PLATFORM_SHARE = [
  { name: "쿠팡", amount: 342500, percent: 40, color: "#FF4B00" },
  { name: "네이버쇼핑", amount: 285000, percent: 34, color: "#03C75A" },
  { name: "무신사", amount: 219700, percent: 26, color: "#222222" },
];

const TREND_DATA = [
  { month: "11월", amount: 580000 },
  { month: "12월", amount: 720000 },
  { month: "1월", amount: 510000 },
  { month: "2월", amount: 690000 },
  { month: "3월", amount: 780000 },
  { month: "4월", amount: 847200 },
];

const INSIGHTS = [
  {
    title: "이번 달 쿠팡 지출이 평소보다 높아요",
    body: "최근 3개월 평균 ₩278,000 대비 이번 달은 ₩342,500으로 23% 증가했어요.",
  },
  {
    title: "매달 반복되는 구매가 감지됐어요",
    body: "네이버쇼핑에서 매월 구매하는 상품 2개가 있어요. 정기결제로 등록하면 관리가 편해져요.",
  },
  {
    title: "패션/의류 지출 비중이 높아요",
    body: "전체 소비의 52%가 패션/의류예요. 지난달보다 ₩64,000 늘었어요.",
  },
];

const TOTAL_CONSUMPTION = 847200;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MonthSelector = styled.button`
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  font-family: inherit;
`;

const DateText = styled.span`
  font-size: 13px;
  color: #9ca3af;
`;

const KpiRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const KpiCard = styled(Card)`
  padding: 20px;
`;

const KpiLabelRow = styled.div`
  display: flex;
  align-items: center;
`;

const KpiDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  display: inline-block;
  margin-right: 6px;
  background: ${({ $color }) => $color};
`;

const KpiLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const KpiValue = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin: 4px 0;
`;

const KpiSub = styled.div<{ $color: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $color }) => $color};
`;

const ChartRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const PieWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PieArea = styled.div`
  width: 180px;
  height: 180px;
  position: relative;
  flex-shrink: 0;

  @media (max-width: 640px) {
    align-self: center;
  }
`;

const PieCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;

  .label {
    font-size: 11px;
    color: #9ca3af;
  }

  .value {
    margin-top: 4px;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
  }
`;

const LegendList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

  .percent {
    font-size: 12px;
    font-weight: 700;
    min-width: 34px;
    text-align: right;
  }

  .amount {
    font-size: 11px;
    color: #9ca3af;
    min-width: 80px;
    text-align: right;
  }
`;

const ChartArea = styled.div`
  width: 100%;
  height: 240px;
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

const TrendFooter = styled.div`
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

const LinkText = styled.button`
  font-size: 12px;
  color: #4f6ef7;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  font-family: inherit;
`;

const Divider = styled.div`
  height: 1px;
  background: #f3f4f6;
`;

const TxRow = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 0;
  gap: 14px;
`;

const TxIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $color }) => $color};
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TxInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TxName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TxMeta = styled.div`
  font-size: 11px;
  color: #9ca3af;
`;

const TxAmount = styled.div<{ $type: "expense" | "income" }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $type }) => ($type === "expense" ? "#111827" : "#3e76fc")};
  flex-shrink: 0;
`;

const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px;
`;

const InsightRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const InsightCard = styled(Card)`
  padding: 20px;
  background: #f7f8ff;
`;

const InsightTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10px;
`;

const InsightBody = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
`;

const PieTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: (typeof PLATFORM_SHARE)[number] }>;
}) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <TooltipBox>
      <div className="label">{data.name}</div>
      <div className="value">₩{data.amount.toLocaleString("ko-KR")}</div>
    </TooltipBox>
  );
};

const TrendTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: (typeof TREND_DATA)[number] }>;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <TooltipBox>
      <div className="label">{payload[0].payload.month}</div>
      <div className="value">₩{payload[0].value.toLocaleString("ko-KR")}</div>
    </TooltipBox>
  );
};

export const HomePage = () => {
  const navigate = useNavigate();
  const recentTransactions = mockTransactions.slice(0, 3);

  return (
    <AppShell
      activeNav="home"
      title="대시보드"
      headerRight={
        <HeaderRight>
          <MonthSelector type="button">2025년 4월 ▼</MonthSelector>
          <DateText>2025년 4월 19일 토요일</DateText>
        </HeaderRight>
      }
    >
      <KpiRow>
        <KpiCard padding={20}>
          <KpiLabel>총 지출</KpiLabel>
          <KpiValue>₩847,200</KpiValue>
          <KpiSub $color="#D92626">▲ 전월 대비 +12%</KpiSub>
        </KpiCard>

        <KpiCard padding={20}>
          <KpiLabelRow>
            <KpiDot $color="#FF4B00" />
            <KpiLabel>이번 달 총 수입</KpiLabel>
          </KpiLabelRow>
          <KpiValue>₩58,000</KpiValue>
          <KpiSub $color="#6B7280">환불 1건 · 취소 1건</KpiSub>
        </KpiCard>

        <KpiCard padding={20}>
          <KpiLabelRow>
            <KpiDot $color="#FF4B00" />
            <KpiLabel>환불/취소 금액</KpiLabel>
          </KpiLabelRow>
          <KpiValue>₩58,000</KpiValue>
          <KpiSub $color="#6B7280">환불 ₩39,000 · 취소 ₩19,000</KpiSub>
        </KpiCard>
      </KpiRow>

      <ChartRow>
        <Card padding={24}>
          <CardHeader title="플랫폼별 소비 비율" subtitle="이번달 기준" />
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
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={2}
                  >
                    {PLATFORM_SHARE.map((item) => (
                      <Cell
                        key={item.name}
                        fill={item.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <PieCenter>
                <div className="label">이번달 총 소비</div>
                <div className="value">
                  ₩{TOTAL_CONSUMPTION.toLocaleString("ko-KR")}
                </div>
              </PieCenter>
            </PieArea>

            <LegendList>
              {PLATFORM_SHARE.map((item) => (
                <LegendRow key={item.name}>
                  <span className="dot" style={{ background: item.color }} />
                  <span className="name">{item.name}</span>
                  <span className="percent" style={{ color: item.color }}>
                    {item.percent}%
                  </span>
                  <span className="amount">
                    ₩{item.amount.toLocaleString("ko-KR")}
                  </span>
                </LegendRow>
              ))}
            </LegendList>
          </PieWrap>
        </Card>

        <Card padding={24}>
          <CardHeader title="최근 소비 추이" subtitle="최근 6개월 지출" />
          <ChartArea>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={TREND_DATA}
                margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="homeTrendFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4F6EF7" stopOpacity={0.28} />
                    <stop
                      offset="100%"
                      stopColor="#4F6EF7"
                      stopOpacity={0}
                    />
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
                  tickFormatter={(value: number) =>
                    `${Math.round(value / 10000)}만`
                  }
                />
                <Tooltip content={<TrendTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#4F6EF7"
                  strokeWidth={2.5}
                  fill="url(#homeTrendFill)"
                  dot={{ fill: "#4F6EF7", r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: "#4F6EF7",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartArea>
          <TrendFooter>
            <span className="label">최근 6개월 평균</span>
            <span className="value">₩687,867/월</span>
          </TrendFooter>
        </Card>
      </ChartRow>

      <Card padding={24} style={{ marginBottom: 16 }}>
        <CardHeader
          title="4월 최근 거래"
          right={
            <LinkText type="button" onClick={() => navigate("/transactions")}>
              전체보기 →
            </LinkText>
          }
        />

        {recentTransactions.map((transaction, index) => (
          <div key={transaction.id}>
            {index > 0 && <Divider />}
            <TxRow>
              <TxIcon $color={platformColor(transaction.platform)}>
                {platformInitial(transaction.platform)}
              </TxIcon>
              <TxInfo>
                <TxName>{transaction.title}</TxName>
                <TxMeta>
                  {platformLabel(transaction.platform)} · {transaction.date}
                </TxMeta>
              </TxInfo>
              <TxAmount $type={transaction.type}>
                {formatAmount(transaction.amount, transaction.type)}
              </TxAmount>
            </TxRow>
          </div>
        ))}
      </Card>

      <SectionTitle>소비 인사이트</SectionTitle>
      <InsightRow>
        {INSIGHTS.map((insight) => (
          <InsightCard key={insight.title} padding={20}>
            <InsightTitle>{insight.title}</InsightTitle>
            <InsightBody>{insight.body}</InsightBody>
          </InsightCard>
        ))}
      </InsightRow>
    </AppShell>
  );
};
