import React from "react";
import styled from "styled-components";
import { Card, CardBd, CardHd, CardTitle } from "../../../components/primitives/Card";
import { Chip } from "../../../components/primitives/Chip";
import { tokens } from "../../../styles/tokens";
import { formatKRW } from "../../../utils/format";

export interface RepeatItem {
  rank: 1 | 2 | 3;
  title: string;
  platform: string;
  category: string;
  count: number;
  amount: number;
}

const RANK_COLOR: Record<number, string> = {
  1: "#B45309",
  2: "#9A8A32",
  3: "#6B7280",
};

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 28px 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 10px 0;

  & + & {
    border-top: 1px solid ${tokens.color.line2};
  }
`;

const Rank = styled.div<{ $color: string }>`
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  color: #fff;
  font-size: 12px;
  font-weight: 700;
`;

const Title = styled.div`
  color: ${tokens.color.ink1};
  font-size: 13.5px;
  font-weight: 500;
`;

const Meta = styled.div`
  color: ${tokens.color.ink4};
  font-size: 11px;
`;

const Count = styled.span`
  color: ${tokens.color.accentHover};
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const Amount = styled.span`
  color: ${tokens.color.ink1};
  font-family: ${tokens.font.mono};
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

export const RepeatTop3: React.FC<{ items: RepeatItem[] }> = ({ items }) => (
  <Card>
    <CardHd>
      <CardTitle>반복 구매 TOP 3</CardTitle>
      <Chip tone="info">이번 달 3회 이상 구매</Chip>
    </CardHd>
    <CardBd>
      <List>
        {items.map((item) => (
          <Row key={item.rank}>
            <Rank $color={RANK_COLOR[item.rank]}>{item.rank}</Rank>
            <div>
              <Title>{item.title}</Title>
              <Meta>
                {item.platform} · {item.category}
              </Meta>
            </div>
            <Count>{item.count}회</Count>
            <Amount>{formatKRW(item.amount)}</Amount>
          </Row>
        ))}
      </List>
    </CardBd>
  </Card>
);
