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
    font-size: 13px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

const Chart: React.FC<{ points: Point[] }> = ({ points }) => {
  const width = 1080;
  const height = 220;
  const pad = { l: 20, r: 20, t: 20, b: 32 };
  const innerWidth = width - pad.l - pad.r;
  const innerHeight = height - pad.t - pad.b;
  const min = Math.min(...points.map((point) => point.value));
  const max = Math.max(...points.map((point) => point.value));
  const stepX = innerWidth / (points.length - 1);
  const coords = points.map((point, index) => ({
    x: pad.l + index * stepX,
    y: pad.t + innerHeight - ((point.value - min) / (max - min || 1)) * innerHeight,
    label: point.label,
  }));
  const line = coords.map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x} ${coord.y}`).join(" ");
  const area = `${line} L${coords.at(-1)!.x} ${pad.t + innerHeight} L${coords[0].x} ${pad.t + innerHeight} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      <path d={area} fill={tokens.color.accentSubtle} opacity={0.55} />
      <path d={line} fill="none" stroke={tokens.color.accent} strokeWidth={2} />
      {coords.map((coord) => (
        <g key={coord.label}>
          <circle cx={coord.x} cy={coord.y} r={4} fill="#fff" stroke={tokens.color.accent} strokeWidth={2} />
          <text x={coord.x} y={height - 8} textAnchor="middle" fontSize="11" fill={tokens.color.ink4}>
            {coord.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

export const MonthlyTrend: React.FC<{ points: Point[]; average: number }> = ({
  points,
  average,
}) => (
  <Card>
    <CardHd>
      <HeaderWrap>
        <div>
          <CardTitle>월별 소비 추이</CardTitle>
          <CardSub>최근 6개월간 결제금액 추이</CardSub>
        </div>
        <div className="meta">
          <div className="meta-label">최근 6개월 평균</div>
          <div className="meta-value">{formatKRW(average)}/월</div>
        </div>
      </HeaderWrap>
    </CardHd>
    <CardBd>
      <Chart points={points} />
    </CardBd>
  </Card>
);
