/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Upload\components\MethodCard.tsx
 */
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";

export interface MethodCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  ctaVariant: "primary" | "ghost";
  footnote: string;
  href: string;
}

const Card = styled(Link)`
  display: block;
  padding: 32px 28px 24px;
  background: ${tokens.color.panel};
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.card};
  box-shadow: ${tokens.shadow.card};
  color: inherit;
  text-decoration: none;
  transition:
    border-color ${tokens.motion.fast},
    transform ${tokens.motion.fast},
    box-shadow ${tokens.motion.fast};

  &:hover {
    border-color: ${tokens.color.accent};
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(79, 70, 229, 0.08), ${tokens.shadow.card};
  }
`;

const IconBox = styled.div`
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  margin: 0 auto 18px;
  border-radius: 12px;
  background: ${tokens.color.accentSubtle};
  color: ${tokens.color.accent};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Title = styled.h3`
  margin: 0 0 6px;
  color: ${tokens.color.ink1};
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

const Desc = styled.p`
  margin: 0 0 20px;
  color: ${tokens.color.ink3};
  text-align: center;
  white-space: pre-line;
  font-size: 13px;
  line-height: 1.6;
`;

const Foot = styled.div`
  margin-top: 12px;
  color: ${tokens.color.ink4};
  text-align: center;
  font-size: 11px;
`;

const Cta = styled.div<{ $variant: "primary" | "ghost" }>`
  display: inline-flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: ${tokens.radius.control};
  font-size: 14px;
  font-weight: 600;

  ${({ $variant }) =>
    $variant === "primary"
      ? `
        background: ${tokens.color.accent};
        color: #fff;
      `
      : `
        background: transparent;
        color: ${tokens.color.ink2};
        border-color: ${tokens.color.line};
      `}
`;

export const MethodCard: React.FC<MethodCardProps> = ({
  icon,
  title,
  description,
  ctaLabel,
  ctaVariant,
  footnote,
  href,
}) => (
  <Card to={href}>
    <IconBox>{icon}</IconBox>
    <Title>{title}</Title>
    <Desc>{description}</Desc>
    <Cta $variant={ctaVariant}>{ctaLabel}</Cta>
    <Foot>{footnote}</Foot>
  </Card>
);

