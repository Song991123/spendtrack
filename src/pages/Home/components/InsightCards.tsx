/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Home\components\InsightCards.tsx
 */
import React from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";

export type InsightKind = "warn" | "repeat" | "category";

export interface InsightItem {
  id: string;
  kind: InsightKind;
  title: string;
  body: string;
}

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  padding: 14px 16px;
  background: ${tokens.color.panel};
  border: 1px solid ${tokens.color.line};
  border-left: 3px solid ${tokens.color.accent};
  border-radius: ${tokens.radius.card};
  box-shadow: ${tokens.shadow.card};
`;

const Title = styled.h4`
  margin: 0 0 6px;
  color: ${tokens.color.ink1};
  font-size: 13px;
  font-weight: 600;
`;

const Body = styled.p`
  margin: 0;
  color: ${tokens.color.ink3};
  font-size: 12px;
  line-height: 1.55;
`;

export const InsightCards: React.FC<{ items: InsightItem[] }> = ({ items }) => (
  <Grid>
    {items.map((item) => (
      <Card key={item.id}>
        <Title>{item.title}</Title>
        <Body>{item.body}</Body>
      </Card>
    ))}
  </Grid>
);

