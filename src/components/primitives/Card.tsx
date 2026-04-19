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
  transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;

  .titles {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  h3 {
    margin: 0;
    color: ${tokens.color.ink2};
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: -0.15px;
  }

  .subtitle {
    color: ${tokens.color.ink4};
    font-size: 11.5px;
    font-weight: 400;
  }
`;

export const CardHd = styled.div<{ bare?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: ${({ bare }) => (bare ? "none" : `1px solid ${tokens.color.line2}`)};
`;

export const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: ${tokens.color.ink2};
  font-size: 13px;
  font-weight: 600;
`;

export const CardSub = styled.p`
  margin: 2px 0 0;
  color: ${tokens.color.ink4};
  font-size: 11px;
`;

export const CardBd = styled.div`
  padding: 16px;
`;

export const CardFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: ${tokens.color.foot};
  border-top: 1px solid ${tokens.color.line2};
  border-radius: 0 0 ${tokens.radius.card} ${tokens.radius.card};
  color: ${tokens.color.ink3};
  font-size: 12px;
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
