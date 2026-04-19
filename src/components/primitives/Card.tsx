/**
 * 역할: 버튼, 카드처럼 여러 화면에서 재사용하는 기본 UI 컴포넌트입니다.
 * 위치: src\components\primitives\Card.tsx
 */
import type { HTMLAttributes, ReactNode } from "react";
import styled from "styled-components";
import { tokens } from "../../styles/tokens";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: number | string;
  children: ReactNode;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

const Container = styled.div<{ $padding: string }>`
  background: ${tokens.color.panel};
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.card};
  padding: ${({ $padding }) => $padding};
  box-shadow: ${tokens.shadow.card};
  transition:
    transform ${tokens.motion.fast} ease,
    box-shadow ${tokens.motion.fast} ease,
    border-color ${tokens.motion.fast} ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${tokens.space[3]};
  margin-bottom: ${tokens.space[3]};

  .titles {
    display: flex;
    flex-direction: column;
    gap: ${tokens.space[1]};
  }

  h3 {
    margin: 0;
    color: ${tokens.color.ink2};
    font-size: ${tokens.type.titleLg.size};
    font-weight: ${tokens.type.titleLg.weight};
    letter-spacing: ${tokens.type.titleLg.tracking};
  }

  .subtitle {
    color: ${tokens.color.ink4};
    font-size: ${tokens.type.cardSub.size};
    font-weight: ${tokens.type.cardSub.weight};
  }
`;

export const CardHd = styled.div<{ bare?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${tokens.space[4]} ${tokens.space[4]} ${tokens.space[3]};
  border-bottom: ${({ bare }) => (bare ? "none" : `1px solid ${tokens.color.line2}`)};
`;

export const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${tokens.space[2]};
  margin: 0;
  color: ${tokens.color.ink2};
  font-size: ${tokens.type.cardTitle.size};
  font-weight: ${tokens.type.cardTitle.weight};
`;

export const CardSub = styled.p`
  margin: 2px 0 0;
  color: ${tokens.color.ink4};
  font-size: ${tokens.type.cardSub.size};
`;

export const CardBd = styled.div`
  padding: ${tokens.space[4]};
`;

export const CardFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${tokens.space[3]} ${tokens.space[4]};
  background: ${tokens.color.foot};
  border-top: 1px solid ${tokens.color.line2};
  border-radius: 0 0 ${tokens.radius.card} ${tokens.radius.card};
  color: ${tokens.color.ink3};
  font-size: ${tokens.type.caption.size};
`;

export const Card = ({ padding = 20, children, ...rest }: CardProps) => {
  const resolvedPadding = typeof padding === "number" ? `${padding}px` : padding;
  return (
    <Container $padding={resolvedPadding} {...rest}>
      {children}
    </Container>
  );
};

export const CardHeader = ({ title, subtitle, right }: CardHeaderProps) => (
  <Header>
    <div className="titles">
      <h3>{title}</h3>
      {subtitle && <span className="subtitle">{subtitle}</span>}
    </div>
    {right}
  </Header>
);

