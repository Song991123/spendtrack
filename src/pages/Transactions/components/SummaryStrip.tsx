import React from "react";
import styled from "styled-components";
import { Card, CardBd } from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";
import { formatKRW } from "../../../utils/format";

export interface SummaryData {
  total: number;
  spendCount: number;
  incomeCount: number;
  totalSpend: number;
  incomeAndRefund: number;
  refundCount: number;
  netSpend: number;
  countLabel: string;
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

export const SummaryStrip: React.FC<{ summary: SummaryData }> = ({ summary }) => (
  <Strip>
    <Card>
      <CardBd>
        <Label>전체 거래</Label>
        <Value>{summary.total}건</Value>
        <Sub>
          지출 {summary.spendCount} · 수입 {summary.incomeCount}
        </Sub>
      </CardBd>
    </Card>
    <Card>
      <CardBd>
        <Label>총 지출</Label>
        <Value $color={tokens.color.neg}>{formatKRW(summary.totalSpend)}</Value>
        <Sub>전월 대비 +12%</Sub>
      </CardBd>
    </Card>
    <Card>
      <CardBd>
        <Label>총 수입·환불</Label>
        <Value $color={tokens.color.pos}>+{formatKRW(summary.incomeAndRefund)}</Value>
        <Sub>환불 {summary.refundCount}건</Sub>
      </CardBd>
    </Card>
    <Card>
      <CardBd>
        <Label>순 지출</Label>
        <Value>{formatKRW(summary.netSpend)}</Value>
        <Sub>지출 − 수입</Sub>
      </CardBd>
    </Card>
  </Strip>
);
