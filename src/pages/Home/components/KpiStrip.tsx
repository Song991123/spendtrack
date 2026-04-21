/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Home\components\KpiStrip.tsx
 */
import React from "react";
import styled from "styled-components";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Chip } from "../../../components/primitives/Chip";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";
import { formatKRW } from "../../../utils/format";

export interface KpiItem {
  key: string;
  label: string;
  value: number;
  primary?: boolean;
  dotColor?: string;
  valueColor?: string;
  valuePrefix?: string;
  neuChip?: string;
  delta?: { tone: "up" | "down"; text: string };
  sub?: string;
  spark?: number[];
}

/**
 * 레퍼런스 HTML의 `.hero` 스트립을 따라 하나의 패널 안에서 세로 구분선으로 셀을 나누고,
 * primary 셀(총 지출)은 폰트와 sparkline으로 강조합니다. 비-primary 셀은 flex 배분으로
 * 라벨/값은 상단에, 서브텍스트는 하단에 붙여 여백이 가운데로 모이게 했습니다.
 */
const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  background: ${tokens.color.panel};
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.card};
  box-shadow: ${tokens.shadow.card};
  overflow: hidden;

  ${media.tablet} {
    grid-template-columns: 1fr 1fr;
  }

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Cell = styled.div<{ $primary?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: ${({ $primary }) => ($primary ? "16px 20px" : "14px 18px")};
  border-right: 1px solid ${tokens.color.line2};

  &:last-child {
    border-right: none;
  }

  ${media.tablet} {
    &:nth-child(2) {
      border-right: none;
    }
    &:nth-child(3) {
      grid-column: 1 / -1;
      border-top: 1px solid ${tokens.color.line2};
    }
  }

  ${media.mobile} {
    border-right: none;

    & + & {
      border-top: 1px solid ${tokens.color.line2};
    }

    &:nth-child(3) {
      grid-column: auto;
    }
  }
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${tokens.color.ink3};
  font-size: 12px;
  font-weight: 500;
`;

const Dot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`;

const Value = styled.div<{ $primary?: boolean; $color?: string }>`
  margin-top: 6px;
  color: ${({ $color }) => $color ?? tokens.color.ink1};
  font-size: ${({ $primary }) => ($primary ? "30px" : "22px")};
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
`;

/**
 * 비-primary 셀의 메타를 셀 바닥에 붙이기 위해 `margin-top: auto`를 주는 컨테이너입니다.
 * primary 셀은 아래에 sparkline이 이어지므로 push를 하지 않고 자연 위치에 둡니다.
 */
const MetaTail = styled.div<{ $pushDown?: boolean }>`
  ${({ $pushDown }) => $pushDown && "margin-top: auto; padding-top: 10px;"}
`;

const Sub = styled.div`
  margin-top: 4px;
  color: ${tokens.color.ink4};
  font-size: 11.5px;
`;

const Spark: React.FC<{ data: number[] }> = ({ data }) => {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div style={{ height: 32, marginTop: 10 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
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
            strokeWidth={1.6}
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
      <Cell key={kpi.key} $primary={kpi.primary}>
        <LabelRow>
          {kpi.dotColor && <Dot $color={kpi.dotColor} />}
          <span>{kpi.label}</span>
          {kpi.neuChip && <Chip tone="neu">{kpi.neuChip}</Chip>}
        </LabelRow>
        <Value
          className="tnum"
          $primary={kpi.primary}
          $color={kpi.valueColor}
        >
          {kpi.valuePrefix}
          {formatKRW(kpi.value)}
        </Value>
        <MetaTail $pushDown={!kpi.primary}>
          {kpi.delta && (
            <MetaRow>
              <Chip tone={kpi.delta.tone === "up" ? "up" : "down"}>
                {kpi.delta.tone === "up" ? "상승" : "하락"} {kpi.delta.text}
              </Chip>
            </MetaRow>
          )}
          {kpi.sub && <Sub>{kpi.sub}</Sub>}
        </MetaTail>
        {kpi.spark && <Spark data={kpi.spark} />}
      </Cell>
    ))}
  </Strip>
);
