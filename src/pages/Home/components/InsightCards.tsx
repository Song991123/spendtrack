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

/**
 * 레퍼런스의 `.ins-card` 패턴을 따라 kind별로 색상이 다른 28x28 아이콘을 왼쪽에 둡니다.
 * kind를 warn/info/ok 3가지 톤으로 매핑해 "경고 / 반복 알림 / 카테고리 안내" 느낌을 시각화합니다.
 */
type IconTone = "warn" | "info" | "ok";

const TONE_MAP: Record<InsightKind, IconTone> = {
  warn: "warn",
  repeat: "info",
  category: "ok",
};

const TONE_STYLES: Record<IconTone, { bg: string; fg: string }> = {
  warn: { bg: "#FEF3C7", fg: "#92400E" },
  info: { bg: "#DBEAFE", fg: "#1E40AF" },
  ok: { bg: "#D1FAE5", fg: "#065F46" },
};

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionLabel = styled.h3`
  margin: 0;
  color: ${tokens.color.ink3};
  font-size: ${tokens.type.caption.size};
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 12px;
  padding: 14px 16px;
  background: ${tokens.color.panel};
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.card};
  box-shadow: ${tokens.shadow.card};
`;

const Icon = styled.div<{ $tone: IconTone }>`
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  background: ${({ $tone }) => TONE_STYLES[$tone].bg};
  color: ${({ $tone }) => TONE_STYLES[$tone].fg};
`;

const Title = styled.h4`
  margin: 0 0 4px;
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

const Icons: Record<IconTone, React.ReactNode> = {
  warn: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 1.5 15 13.5H1L8 1.5Z" />
      <path d="M8 6.5v3.5" />
      <circle cx="8" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  info: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5" />
      <path d="M13.5 2.5v3.5h-3.5" />
    </svg>
  ),
  ok: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  ),
};

export const InsightCards: React.FC<{ items: InsightItem[] }> = ({ items }) => (
  <Wrapper>
    <SectionLabel>소비 인사이트</SectionLabel>
    <Grid>
      {items.map((item) => {
        const tone = TONE_MAP[item.kind];
        return (
          <Card key={item.id}>
            <Icon $tone={tone}>{Icons[tone]}</Icon>
            <div>
              <Title>{item.title}</Title>
              <Body>{item.body}</Body>
            </div>
          </Card>
        );
      })}
    </Grid>
  </Wrapper>
);
