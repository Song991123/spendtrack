import type { ReactNode } from "react";
import styled from "styled-components";

interface TopHeaderProps {
  title: string;
  right?: ReactNode;
}

const Header = styled.header`
  height: 56px;
  padding: 0 32px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.2px;
`;

const RightSlot = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 400;
`;

export const TopHeader = ({ title, right }: TopHeaderProps) => (
  <Header>
    <Title>{title}</Title>
    {right && <RightSlot>{right}</RightSlot>}
  </Header>
);