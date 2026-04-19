import React from "react";
import styled from "styled-components";
import { Card, CardBd, CardHd, CardTitle } from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";

export interface CategoryBarItem {
  label: string;
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
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  font-size: 13px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .label {
    min-width: 74px;
    color: ${tokens.color.ink2};
    font-weight: 500;
  }

  .pct {
    color: ${tokens.color.ink3};
    font-size: 12.5px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

const InlineTrackWrap = styled.div`
  display: grid;
  grid-template-columns: 86px 1fr;
  gap: 10px;
  align-items: center;
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
`;

export const CategoryBars: React.FC<{ items: CategoryBarItem[] }> = ({ items }) => (
  <Card>
    <CardHd>
      <CardTitle>카테고리별 지출</CardTitle>
    </CardHd>
    <CardBd>
      <List>
        {items.map((item) => (
          <Row key={item.label}>
            <span className="dot" style={{ background: item.color }} />
            <InlineTrackWrap>
              <span className="label">{item.label}</span>
              <Track>
                <Fill $color={item.color} $percent={item.percent} />
              </Track>
            </InlineTrackWrap>
            <span className="pct">{item.percent}%</span>
          </Row>
        ))}
      </List>
    </CardBd>
  </Card>
);
