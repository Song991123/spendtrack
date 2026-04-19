import React from "react";
import styled from "styled-components";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardBd,
  CardHd,
  CardSub,
  CardTitle,
} from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";
import { formatKRW } from "../../../utils/format";

export interface DonutItem {
  label: string;
  value: number;
  percent: number;
  color: string;
}

const Body = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 20px;
  align-items: center;

  ${media.mobile} {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const Legend = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 10px;
  align-items: center;
  color: ${tokens.color.ink2};
  font-size: 13px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .label {
    font-weight: 500;
  }

  .pct {
    color: ${tokens.color.ink3};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .amt {
    color: ${tokens.color.ink4};
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
`;

const DonutWrap = styled.div`
  width: 180px;
  height: 180px;
  position: relative;
`;

const CenterLabel = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  pointer-events: none;

  .amount {
    color: ${tokens.color.ink1};
    font-size: 15px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .caption {
    margin-top: 4px;
    color: ${tokens.color.ink4};
    font-size: 10px;
  }
`;

export const PlatformDonut: React.FC<{ total: number; items: DonutItem[] }> = ({
  total,
  items,
}) => (
  <Card>
    <CardHd>
      <div>
        <CardTitle>플랫폼별 소비 비중</CardTitle>
        <CardSub>이번 달 기준</CardSub>
      </div>
    </CardHd>
    <CardBd>
      <Body>
        <DonutWrap>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="value"
                nameKey="label"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={2}
                stroke="none"
              >
                {items.map((item) => (
                  <Cell key={item.label} fill={item.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [formatKRW(Number(value ?? 0)), "금액"]}
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${tokens.color.line}`,
                  boxShadow: tokens.shadow.card,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <CenterLabel>
            <div>
              <div className="amount">{formatKRW(total)}</div>
              <div className="caption">이번 달 총소비</div>
            </div>
          </CenterLabel>
        </DonutWrap>
        <Legend>
          {items.map((item) => (
            <Row key={item.label}>
              <span className="dot" style={{ background: item.color }} />
              <span className="label">{item.label}</span>
              <span className="pct">{item.percent}%</span>
              <span className="amt">{formatKRW(item.value)}</span>
            </Row>
          ))}
        </Legend>
      </Body>
    </CardBd>
  </Card>
);
