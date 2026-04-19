/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Analysis\components\CategoryBars.tsx
 */
import React from "react";
import styled from "styled-components";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardBd, CardHd, CardTitle } from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";

export interface CategoryBarItem {
  label: string;
  percent: number;
  color: string;
}

const ChartWrap = styled.div`
  height: 212px;
`;

export const CategoryBars: React.FC<{ items: CategoryBarItem[] }> = ({ items }) => (
  <Card>
    <CardHd>
      <CardTitle>카테고리별 지출</CardTitle>
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
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={92}
              tick={{ fill: tokens.color.ink2, fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [`${Number(value ?? 0)}%`, "비중"]}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${tokens.color.line}`,
                boxShadow: tokens.shadow.card,
              }}
            />
            <Bar dataKey="percent" radius={[0, 8, 8, 0]} isAnimationActive={false}>
              {items.map((item) => (
                <Cell key={item.label} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartWrap>
    </CardBd>
  </Card>
);

