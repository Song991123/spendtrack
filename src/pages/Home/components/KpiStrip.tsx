import React from "react";
import styled from "styled-components";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
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
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div style={{ height: 44, marginTop: 10 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="home-kpi-spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={tokens.color.accent} stopOpacity={0.28} />
              <stop offset="100%" stopColor={tokens.color.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={tokens.color.accent}
            strokeWidth={2}
            fill="url(#home-kpi-spark)"
            fillOpacity={1}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
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
                {kpi.delta.tone === "up" ? "상승" : "하락"} {kpi.delta.text}
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
