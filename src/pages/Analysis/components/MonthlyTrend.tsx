/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Analysis\components\MonthlyTrend.tsx
 */
import React from "react";
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
import {
  Card,
  CardBd,
  CardHd,
  CardSub,
  CardTitle,
} from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";
import { formatKRW } from "../../../utils/format";

interface Point {
  label: string;
  value: number;
}

const HeaderWrap = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 100%;

  .meta {
    text-align: right;
  }

  .meta-label {
    color: ${tokens.color.ink4};
    font-size: 11px;
  }

  .meta-value {
    color: ${tokens.color.ink2};
    font-family: ${tokens.font.mono};
    font-size: 12px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

/**
 * 레퍼런스 HTML은 200px 높이의 SVG 라인 그래프를 씁니다.
 * recharts는 그대로 쓰되 비슷한 높이로 맞춰 카드가 과하게 커 보이지 않게 합니다.
 */
const ChartWrap = styled.div`
  height: 200px;
`;

export const MonthlyTrend: React.FC<{ points: Point[]; average: number }> = ({
  points,
  average,
}) => (
  <Card>
    <CardHd>
      <HeaderWrap>
        <div>
          <CardTitle>월간 소비 추이</CardTitle>
          <CardSub>최근 6개월 결제금액 추이</CardSub>
        </div>
        <div className="meta">
          <div className="meta-label">6개월 평균</div>
          <div className="meta-value">{formatKRW(average)}/월</div>
        </div>
      </HeaderWrap>
    </CardHd>
    <CardBd style={{ paddingTop: 4 }}>
      <ChartWrap>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="analysis-trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tokens.color.accent} stopOpacity={0.16} />
                <stop offset="100%" stopColor={tokens.color.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={tokens.color.line2} strokeDasharray="2 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: tokens.color.ink4, fontSize: 11 }}
            />
            <YAxis hide domain={["dataMin - 40000", "dataMax + 40000"]} />
            <Tooltip
              formatter={(value) => [formatKRW(Number(value ?? 0)), "결제금액"]}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${tokens.color.line}`,
                boxShadow: tokens.shadow.card,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={tokens.color.accent}
              strokeWidth={2}
              fill="url(#analysis-trend-fill)"
              activeDot={{ r: 4, stroke: tokens.color.accent, strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrap>
    </CardBd>
  </Card>
);
