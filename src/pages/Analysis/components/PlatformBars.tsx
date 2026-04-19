import React from "react";
import styled from "styled-components";
import { Card, CardBd, CardHd, CardTitle } from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";
import { formatKRW } from "../../../utils/format";

export interface PlatformBarItem {
  label: string;
  value: number;
  percent: number;
  color: string;
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 12px;
  align-items: center;
  font-size: 13px;
`;

const Track = styled.div`
  height: 8px;
  border-radius: 4px;
  background: ${tokens.color.line2};
  overflow: hidden;
`;

const Fill = styled.div<{ $color: string; $percent: number }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  background: ${({ $color }) => $color};
  border-radius: 4px;
`;

const Label = styled.span`
  color: ${tokens.color.ink2};
  font-weight: 500;
`;

const Amount = styled.span`
  color: ${tokens.color.ink2};
  font-family: ${tokens.font.mono};
  font-size: 12.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const Summary = styled.div`
  display: grid;
  gap: 6px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid ${tokens.color.line2};
  font-size: 13px;

  .row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .label {
    color: ${tokens.color.ink3};
  }

  .value {
    color: ${tokens.color.ink2};
    font-family: ${tokens.font.mono};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .income .label {
    color: ${tokens.color.accentHover};
  }

  .income .value {
    color: ${tokens.color.pos};
  }

  .net .value {
    color: ${tokens.color.neg};
  }
`;

export const PlatformBars: React.FC<{
  items: PlatformBarItem[];
  totalSpend: number;
  totalIncome: number;
  netSpend: number;
}> = ({ items, totalSpend, totalIncome, netSpend }) => (
  <Card>
    <CardHd>
      <CardTitle>플랫폼별 지출</CardTitle>
    </CardHd>
    <CardBd>
      <List>
        {items.map((item) => (
          <Row key={item.label}>
            <Label>{item.label}</Label>
            <Track>
              <Fill $color={item.color} $percent={item.percent} />
            </Track>
            <Amount>
              {formatKRW(item.value)} ({item.percent}%)
            </Amount>
          </Row>
        ))}
      </List>
      <Summary>
        <div className="row">
          <span className="label">이번 달 총 지출</span>
          <span className="value">{formatKRW(totalSpend)}</span>
        </div>
        <div className="row income">
          <span className="label">이번 달 총 수입</span>
          <span className="value">+{formatKRW(totalIncome)}</span>
        </div>
        <div className="row net">
          <span className="label">순 지출 (지출 − 수입)</span>
          <span className="value">{formatKRW(netSpend)}</span>
        </div>
      </Summary>
    </CardBd>
  </Card>
);
