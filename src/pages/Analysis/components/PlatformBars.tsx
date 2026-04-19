/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Analysis\components\PlatformBars.tsx
 */
import React from "react";
import styled from "styled-components";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardBd, CardHd, CardTitle } from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";
import { formatKRW } from "../../../utils/format";

export interface PlatformBarItem {
  label: string;
  value: number;
  percent: number;
  color: string;
}

const ChartWrap = styled.div`
  height: 212px;
`;

const Summary = styled.div`
  display: grid;
  gap: 6px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid ${tokens.color.line2};
  font-size: 13px;

  .row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .label {
    color: ${tokens.color.ink3};
  }

  .value {
    color: ${tokens.color.ink2};
    font-family: ${tokens.font.mono};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .income .label {
    color: ${tokens.color.accentHover};
  }

  .income .value {
    color: ${tokens.color.pos};
  }

  .net .value {
    color: ${tokens.color.neg};
  }
`;

export const PlatformBars: React.FC<{
  items: PlatformBarItem[];
  totalSpend: number;
  totalIncome: number;
  netSpend: number;
}> = ({ items, totalSpend, totalIncome, netSpend }) => (
  <Card>
    <CardHd>
      <CardTitle>플랫폼별 지출</CardTitle>
    </CardHd>
    <CardBd>
      <ChartWrap>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={items}
            layout="vertical"
            margin={{ top: 8, right: 12, left: 8, bottom: 0 }}
            barCategoryGap={16}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={84}
              tick={{ fill: tokens.color.ink2, fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, _name, entry) => [
                formatKRW(Number(value ?? 0)),
                `${entry.payload.percent}%`,
              ]}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${tokens.color.line}`,
                boxShadow: tokens.shadow.card,
              }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} isAnimationActive={false}>
              {items.map((item) => (
                <Cell key={item.label} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartWrap>
      <Summary>
        <div className="row">
          <span className="label">이번 달 총 지출</span>
          <span className="value">{formatKRW(totalSpend)}</span>
        </div>
        <div className="row income">
          <span className="label">이번 달 총 수입</span>
          <span className="value">+{formatKRW(totalIncome)}</span>
        </div>
        <div className="row net">
          <span className="label">순지출(지출 - 수입)</span>
          <span className="value">{formatKRW(netSpend)}</span>
        </div>
      </Summary>
    </CardBd>
  </Card>
);

