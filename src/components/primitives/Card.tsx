import type { HTMLAttributes, ReactNode } from "react";
import styled from "styled-components";

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
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: ${({ $padding }) => $padding};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
  gap: 12px;

  .titles {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  h3 {
    margin: 0;
    font-size: 14.5px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.15px;
  }
  .subtitle {
    font-size: 11.5px;
    color: #9ca3af;
    font-weight: 400;
  }
`;

export const Card = ({ padding = 20, children, ...rest }: CardProps) => {
  const pv = typeof padding === "number" ? `${padding}px` : padding;
  return (
    <Container $padding={pv} {...rest}>
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