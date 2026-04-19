import React from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";

const Card = styled.section`
  background: ${tokens.color.panel};
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.card};
  padding: 32px;
  box-shadow: ${tokens.shadow.card};
`;

const Title = styled.h1`
  margin: 0 0 6px;
  color: ${tokens.color.ink1};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  margin: 0 0 24px;
  color: ${tokens.color.ink3};
  font-size: 13px;
  line-height: 1.5;
`;

export const AuthCard: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <Card>
    <Title>{title}</Title>
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
    {children}
  </Card>
);
