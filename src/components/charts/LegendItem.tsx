/**
 * 역할: 차트 시각화를 작게 나눈 공통 그래프 컴포넌트입니다.
 * 위치: src\components\charts\LegendItem.tsx
 */
import styled from "styled-components";
import { tokens } from "../../styles/tokens";

interface LegendItemProps {
  color: string;
  label: string;
  percent: string;
  amount: string;
}

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 12px 1fr auto auto;
  align-items: center;
  gap: 8px;
  font-size: 13px;
`;

const Dot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const Label = styled.span`
  color: ${tokens.color.ink1};
  font-weight: 500;
`;

const Percent = styled.span`
  color: ${tokens.color.ink3};
  font-weight: 500;
`;

const Amount = styled.span`
  color: ${tokens.color.ink2};
  font-weight: 500;
`;

export default function LegendItem({
  color,
  label,
  percent,
  amount,
}: LegendItemProps) {
  return (
    <Wrap>
      <Dot $color={color} />
      <Label>{label}</Label>
      <Percent>{percent}</Percent>
      <Amount>{amount}</Amount>
    </Wrap>
  );
}

