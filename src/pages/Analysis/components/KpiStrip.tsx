/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Analysis\components\KpiStrip.tsx
 */
import React from "react";
import styled from "styled-components";
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

/**
 * 레퍼런스의 `.kpi4` 구조를 따릅니다.
 * 4개 카드를 각각 그리는 대신 하나의 bordered 패널을 border-right로 나누어
 * KPI 묶음이 한 그룹이라는 시각적 단위를 강조합니다.
 */
const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  background: ${tokens.color.panel};
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.card};
  overflow: hidden;
  box-shadow: ${tokens.shadow.card};

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Cell = styled.div`
  padding: 16px 18px;
  border-right: 1px solid ${tokens.color.line2};

  &:last-child {
    border-right: none;
  }

  ${media.tablet} {
    &:nth-child(2n) {
      border-right: none;
    }

    &:nth-child(-n + 2) {
      border-bottom: 1px solid ${tokens.color.line2};
    }
  }

  ${media.mobile} {
    border-right: none;
    border-bottom: 1px solid ${tokens.color.line2};

    &:last-child {
      border-bottom: none;
    }
  }
`;

const Label = styled.div`
  color: ${tokens.color.ink4};
  font-size: 11px;
  font-weight: 500;
`;

const Value = styled.div<{ $color?: string }>`
  margin: 4px 0 2px;
  color: ${({ $color }) => $color ?? tokens.color.ink1};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
`;

const SubRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${tokens.color.ink4};
  font-size: 11px;
`;

export const KpiStrip: React.FC<{ kpis: KpiItem[] }> = ({ kpis }) => (
  <Strip>
    {kpis.map((kpi) => (
      <Cell key={kpi.key}>
        <Label>{kpi.label}</Label>
        <Value className="tnum" $color={kpi.valueColor}>
          {kpi.unit ? `${kpi.value}${kpi.unit}` : formatKRW(kpi.value)}
        </Value>
        <SubRow>
          {kpi.delta ? (
            <>
              <Chip tone={kpi.delta.tone === "up" ? "up" : "down"}>
                {kpi.delta.tone === "up" ? "▲" : "▼"} {kpi.delta.text}
              </Chip>
              <span>전월 대비</span>
            </>
          ) : (
            kpi.sub && <span>{kpi.sub}</span>
          )}
        </SubRow>
      </Cell>
    ))}
  </Strip>
);
