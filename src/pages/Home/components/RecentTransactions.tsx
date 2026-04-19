/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Home\components\RecentTransactions.tsx
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Card, CardBd, CardHd, CardTitle } from "../../../components/primitives/Card";
import { Tag } from "../../../components/primitives/Tag";
import { tokens } from "../../../styles/tokens";
import { formatKRW } from "../../../utils/format";
import { PLATFORM_LABELS } from "../../../constants/labels";

type Platform = "coupang" | "naver" | "musinsa";

export interface RecentItem {
  id: string;
  initial: string;
  platform: Platform;
  title: string;
  date: string;
  amount: number;
}

const LinkButton = styled.button`
  border: 0;
  background: transparent;
  color: ${tokens.color.accentHover};
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) auto auto;
  gap: 12px;
  align-items: center;
  padding: 10px 0;

  & + & {
    border-top: 1px solid ${tokens.color.line2};
  }
`;

const Avatar = styled.div`
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 50%;
  background: ${tokens.color.tint};
  color: ${tokens.color.ink2};
  font-size: 12px;
  font-weight: 600;
`;

const Title = styled.div`
  overflow: hidden;
  color: ${tokens.color.ink1};
  font-size: 13.5px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.div`
  color: ${tokens.color.ink4};
  font-size: 11px;
`;

const Amount = styled.div<{ $negative?: boolean }>`
  color: ${({ $negative }) => ($negative ? tokens.color.ink1 : tokens.color.pos)};
  font-family: ${tokens.font.mono};
  font-size: 13.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

export const RecentTransactions: React.FC<{ items: RecentItem[] }> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHd>
        <CardTitle>최근 거래</CardTitle>
        <LinkButton type="button" onClick={() => navigate("/transactions")}>
          전체보기
        </LinkButton>
      </CardHd>
      <CardBd>
        <List>
          {items.map((item) => (
            <Row key={item.id}>
              <Avatar>{item.initial}</Avatar>
              <div>
                <Title>{item.title}</Title>
                <Meta>{item.date}</Meta>
              </div>
              <Tag kind={item.platform}>{PLATFORM_LABELS[item.platform]}</Tag>
              <Amount $negative={item.amount < 0}>
                {item.amount < 0 ? "-" : "+"}
                {formatKRW(Math.abs(item.amount))}
              </Amount>
            </Row>
          ))}
        </List>
      </CardBd>
    </Card>
  );
};

