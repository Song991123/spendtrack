import React from "react";
import styled from "styled-components";
import { Card, CardBd, CardHd, CardTitle } from "../../../components/primitives/Card";
import { Chip } from "../../../components/primitives/Chip";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";
import { formatKRW } from "../../../utils/format";

export interface KpiItem {
  key: string;
  label: string;
  value: number;
  dotColor?: string;
  delta?: { tone: "up" | "down"; text: string };
  sub?: string;
  spark?: number[];
}

const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Big = styled.div`
  margin-top: 8px;
  color: ${tokens.color.ink1};
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
`;

const Sub = styled.div`
  margin-top: 6px;
  color: ${tokens.color.ink4};
  font-size: 11px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const Dot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${tokens.color.ink3};
  font-size: 12px;
  font-weight: 500;
`;

const Spark: React.FC<{ data: number[] }> = ({ data }) => {
  const width = 260;
  const height = 40;
  const pad = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const step = (width - pad * 2) / (data.length - 1);
  const points = data.map((value, index) => {
    const x = pad + index * step;
    const y =
      height - pad - ((value - min) / (max - min || 1)) * (height - pad * 2);
    return [x, y] as const;
  });
  const line = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const area = `${line} L${points[points.length - 1][0]} ${height} L${points[0][0]} ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ marginTop: 10 }}>
      <path d={area} fill={tokens.color.accentSubtle} opacity={0.6} />
      <path d={line} fill="none" stroke={tokens.color.accent} strokeWidth={2} />
    </svg>
  );
};

export const KpiStrip: React.FC<{ kpis: KpiItem[] }> = ({ kpis }) => (
  <Strip>
    {kpis.map((kpi) => (
      <Card key={kpi.key}>
        <CardHd bare>
          <LabelRow>
            {kpi.dotColor && <Dot $color={kpi.dotColor} />}
            <CardTitle as="span">{kpi.label}</CardTitle>
          </LabelRow>
        </CardHd>
        <CardBd>
          <Big className="tnum">{formatKRW(kpi.value)}</Big>
          {kpi.delta && (
            <MetaRow>
              <Chip tone={kpi.delta.tone === "up" ? "up" : "down"}>
                {kpi.delta.tone === "up" ? "▲" : "▼"} {kpi.delta.text}
              </Chip>
            </MetaRow>
          )}
          {kpi.sub && <Sub>{kpi.sub}</Sub>}
          {kpi.spark && <Spark data={kpi.spark} />}
        </CardBd>
      </Card>
    ))}
  </Strip>
);
