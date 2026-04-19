import React from "react";
import styled from "styled-components";
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

const DonutChart: React.FC<{ total: number; items: DonutItem[] }> = ({ total, items }) => {
  const size = 160;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={tokens.color.line2}
        strokeWidth={stroke}
      />
      {items.map((item) => {
        const length = (item.percent / 100) * circumference;
        const node = (
          <circle
            key={item.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={item.color}
            strokeWidth={stroke}
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += length;
        return node;
      })}
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        fontSize="15"
        fontWeight={700}
        fill={tokens.color.ink1}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {formatKRW(total)}
      </text>
      <text x="50%" y="60%" textAnchor="middle" fontSize="10" fill={tokens.color.ink4}>
        이번달 총 소비
      </text>
    </svg>
  );
};

export const PlatformDonut: React.FC<{ total: number; items: DonutItem[] }> = ({
  total,
  items,
}) => (
  <Card>
    <CardHd>
      <div>
        <CardTitle>플랫폼별 소비 비율</CardTitle>
        <CardSub>이번달 기준</CardSub>
      </div>
    </CardHd>
    <CardBd>
      <Body>
        <DonutChart total={total} items={items} />
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
