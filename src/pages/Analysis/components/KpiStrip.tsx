import React from "react";
import styled from "styled-components";
import { Card, CardBd } from "../../../components/primitives/Card";
import { Chip } from "../../../components/primitives/Chip";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";
import { formatKRW } from "../../../utils/format";

export interface KpiItem {
  key: string;
  label: string;
  value: number;
  unit?: string;
  sub?: string;
  delta?: { tone: "up" | "down"; text: string };
  valueColor?: string;
}

const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.div`
  color: ${tokens.color.ink4};
  font-size: 11px;
  font-weight: 500;
`;

const Value = styled.div<{ $color?: string }>`
  margin-top: 4px;
  color: ${({ $color }) => $color ?? tokens.color.ink1};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
`;

const Sub = styled.div`
  margin-top: 6px;
  color: ${tokens.color.ink4};
  font-size: 11px;
`;

export const KpiStrip: React.FC<{ kpis: KpiItem[] }> = ({ kpis }) => (
  <Strip>
    {kpis.map((kpi) => (
      <Card key={kpi.key}>
        <CardBd>
          <Label>{kpi.label}</Label>
          <Value $color={kpi.valueColor}>
            {kpi.unit ? `${kpi.value}${kpi.unit}` : formatKRW(kpi.value)}
          </Value>
          {kpi.delta ? (
            <div style={{ marginTop: 6 }}>
              <Chip tone={kpi.delta.tone === "up" ? "up" : "down"}>
                {kpi.delta.tone === "up" ? "상승" : "하락"} {kpi.delta.text}
              </Chip>
            </div>
          ) : (
            kpi.sub && <Sub>{kpi.sub}</Sub>
          )}
        </CardBd>
      </Card>
    ))}
  </Strip>
);
