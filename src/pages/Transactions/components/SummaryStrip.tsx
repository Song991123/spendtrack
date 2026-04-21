/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Transactions\components\SummaryStrip.tsx
 */
import React from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";
import { formatKRW } from "../../../utils/format";

export interface SummaryDelta {
  /** 양수면 전월 대비 증가 (지출 기준에서는 나쁨), 음수면 감소(좋음). */
  percent: number;
  direction: "up" | "down" | "flat";
}

export interface SummaryData {
  total: number;
  spendCount: number;
  incomeCount: number;
  totalSpend: number;
  incomeAndRefund: number;
  refundCount: number;
  netSpend: number;
  countLabel: string;
  spendDelta?: SummaryDelta;
}

const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  background: ${tokens.color.panel};
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.card};
  box-shadow: ${tokens.shadow.card};
  overflow: hidden;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Cell = styled.div`
  padding: 14px 18px;
  border-right: 1px solid ${tokens.color.line2};

  &:last-child {
    border-right: none;
  }

  ${media.tablet} {
    &:nth-child(2n) {
      border-right: none;
    }
    &:nth-child(odd) {
      border-right: 1px solid ${tokens.color.line2};
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
  margin-top: 4px;
  color: ${({ $color }) => $color ?? tokens.color.ink1};
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
`;

const Sub = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
  color: ${tokens.color.ink4};
  font-size: 11px;
`;

const Chip = styled.span<{ $tone: "up" | "down" | "flat" }>`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 1px 6px;
  border-radius: ${tokens.radius.chip};
  font-size: 10px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  background: ${({ $tone }) =>
    $tone === "up"
      ? tokens.color.negBg
      : $tone === "down"
        ? tokens.color.posBg
        : tokens.color.tint};
  color: ${({ $tone }) =>
    $tone === "up"
      ? tokens.color.neg
      : $tone === "down"
        ? tokens.color.pos
        : tokens.color.ink3};
`;

const formatDelta = (delta: SummaryDelta) => {
  if (delta.direction === "flat") return "0%";
  const sign = delta.direction === "up" ? "+" : "−";
  return `${sign}${Math.abs(delta.percent)}%`;
};

export const SummaryStrip: React.FC<{ summary: SummaryData }> = ({ summary }) => (
  <Strip>
    <Cell>
      <Label>전체 거래</Label>
      <Value className="tnum">{summary.total}건</Value>
      <Sub>
        지출 {summary.spendCount} · 수입 {summary.incomeCount}
      </Sub>
    </Cell>
    <Cell>
      <Label>총 지출</Label>
      <Value className="tnum" $color={tokens.color.neg}>
        {formatKRW(summary.totalSpend)}
      </Value>
      <Sub>
        {summary.spendDelta ? (
          <>
            전월 대비
            <Chip $tone={summary.spendDelta.direction}>{formatDelta(summary.spendDelta)}</Chip>
          </>
        ) : (
          <>지출 거래 {summary.spendCount}건</>
        )}
      </Sub>
    </Cell>
    <Cell>
      <Label>총 수입·환불</Label>
      <Value className="tnum" $color={tokens.color.pos}>
        +{formatKRW(summary.incomeAndRefund)}
      </Value>
      <Sub>환불 {summary.refundCount}건</Sub>
    </Cell>
    <Cell>
      <Label>순 지출</Label>
      <Value className="tnum">{formatKRW(summary.netSpend)}</Value>
      <Sub>지출 − 수입</Sub>
    </Cell>
  </Strip>
);
