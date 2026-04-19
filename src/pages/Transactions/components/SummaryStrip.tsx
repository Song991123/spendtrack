/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Transactions\components\SummaryStrip.tsx
 */
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
  font-size: ${tokens.type.cardSub.size};
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
  font-size: ${tokens.type.cardSub.size};
`;

export const SummaryStrip: React.FC<{ summary: SummaryData }> = ({ summary }) => (
  <Strip>
    <Card>
      <CardBd>
        <Label>전체 거래</Label>
        <Value className="tnum">{summary.total}건</Value>
        <Sub>{summary.countLabel}</Sub>
      </CardBd>
    </Card>
    <Card>
      <CardBd>
        <Label>총 지출</Label>
        <Value className="tnum" $color={tokens.color.neg}>
          {formatKRW(summary.totalSpend)}
        </Value>
        <Sub>지출 거래 {summary.spendCount}건</Sub>
      </CardBd>
    </Card>
    <Card>
      <CardBd>
        <Label>총 수입·환불</Label>
        <Value className="tnum" $color={tokens.color.pos}>
          +{formatKRW(summary.incomeAndRefund)}
        </Value>
        <Sub>환불 {summary.refundCount}건</Sub>
      </CardBd>
    </Card>
    <Card>
      <CardBd>
        <Label>순지출</Label>
        <Value className="tnum">{formatKRW(summary.netSpend)}</Value>
        <Sub>지출에서 수입을 차감한 값</Sub>
      </CardBd>
    </Card>
  </Strip>
);

