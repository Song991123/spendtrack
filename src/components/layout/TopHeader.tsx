/**
 * 역할: 여러 화면이 함께 사용하는 공통 레이아웃 컴포넌트입니다.
 * 위치: src\components\layout\TopHeader.tsx
 */
import type { ReactNode } from "react";
import styled from "styled-components";
import { tokens } from "../../styles/tokens";
import { media } from "../../tokens/breakpoints";

interface TopHeaderProps {
  crumb?: string;
  title: string;
  right?: ReactNode;
}

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;

  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Heading = styled.div`
  min-width: 0;
`;

const Crumb = styled.div`
  color: ${tokens.color.ink4};
  font-size: 12px;
  font-weight: 500;
`;

const Title = styled.h1`
  margin: 2px 0 0;
  color: ${tokens.color.ink1};
  font-size: ${tokens.type.h1.size};
  font-weight: ${tokens.type.h1.weight};
  letter-spacing: ${tokens.type.h1.tracking};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RightSlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  margin-left: auto;
  color: ${tokens.color.ink3};
  font-size: 13px;
  font-weight: 400;

  ${media.mobile} {
    width: 100%;
    margin-left: 0;
    justify-content: stretch;
  }
`;

export const TopHeader = ({ crumb, title, right }: TopHeaderProps) => (
  <Header>
    <Heading>
      {crumb && <Crumb>{crumb}</Crumb>}
      <Title>{title}</Title>
    </Heading>
    {right && <RightSlot>{right}</RightSlot>}
  </Header>
);

