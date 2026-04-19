import React from "react";
import styled from "styled-components";
import {
  Card,
  CardBd,
  CardFoot,
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

const SvgWrap = styled.div`
  padding-top: 4px;
`;

const Chart: React.FC<{ points: Point[] }> = ({ points }) => {
  const width = 540;
  const height = 180;
  const pad = { l: 8, r: 8, t: 16, b: 24 };
  const innerWidth = width - pad.l - pad.r;
  const innerHeight = height - pad.t - pad.b;
  const min = Math.min(...points.map((point) => point.value));
  const max = Math.max(...points.map((point) => point.value));
  const stepX = innerWidth / (points.length - 1);
  const coords = points.map((point, index) => {
    const x = pad.l + index * stepX;
    const y = pad.t + innerHeight - ((point.value - min) / (max - min || 1)) * innerHeight;
    return { x, y, label: point.label };
  });
  const line = coords.map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x} ${coord.y}`).join(" ");
  const area = `${line} L${coords[coords.length - 1].x} ${pad.t + innerHeight} L${coords[0].x} ${pad.t + innerHeight} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      <path d={area} fill={tokens.color.accentSubtle} opacity={0.55} />
      <path d={line} fill="none" stroke={tokens.color.accent} strokeWidth={2} />
      {coords.map((coord) => (
        <g key={coord.label}>
          <circle cx={coord.x} cy={coord.y} r={3.5} fill="#fff" stroke={tokens.color.accent} strokeWidth={2} />
          <text x={coord.x} y={height - 6} textAnchor="middle" fontSize="10" fill={tokens.color.ink4}>
            {coord.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

export const TrendChart: React.FC<{ points: Point[]; average: number }> = ({ points, average }) => (
  <Card>
    <CardHd>
      <div>
        <CardTitle>최근 소비 추이</CardTitle>
        <CardSub>최근 6개월 지출</CardSub>
      </div>
    </CardHd>
    <CardBd>
      <SvgWrap>
        <Chart points={points} />
      </SvgWrap>
    </CardBd>
    <CardFoot>
      <span>최근 6개월 평균</span>
      <span className="tnum" style={{ fontWeight: 600, color: tokens.color.ink2 }}>
        {formatKRW(average)}/월
      </span>
    </CardFoot>
  </Card>
);
