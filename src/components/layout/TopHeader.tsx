import type { ReactNode } from "react";
import styled from "styled-components";
import { media } from "../../tokens/breakpoints";

interface TopHeaderProps {
  title: string;
  right?: ReactNode;
}

const Header = styled.header`
  min-height: 56px;
  padding: 0 32px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-shrink: 0;

  ${media.mobile} {
    padding: 0 16px;
    height: 48px;
    min-height: 48px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.mobile} {
    font-size: 15px;
  }
`;

const RightSlot = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const TopHeader = ({ title, right }: TopHeaderProps) => (
  <Header>
    <Title>{title}</Title>
    {right && <RightSlot>{right}</RightSlot>}
  </Header>
);
