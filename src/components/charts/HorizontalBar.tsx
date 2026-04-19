/**
 * 역할: 차트 시각화를 작게 나눈 공통 그래프 컴포넌트입니다.
 * 위치: src\components\charts\HorizontalBar.tsx
 */
import styled from "styled-components";
import { tokens } from "../../styles/tokens";

interface Props {
  value: number;
  max: number;
}

const Bar = styled.div`
  width: 100%;
  height: 8px;
  background: ${tokens.color.line2};
`;

const Fill = styled.div<{ $width: number }>`
  height: 100%;
  background: ${tokens.color.ink1};
  width: ${({ $width }) => `${$width}%`};
`;

export default function HorizontalBar({ value, max }: Props) {
  const width = max === 0 ? 0 : (value / max) * 100;

  return (
    <Bar>
      <Fill $width={width} />
    </Bar>
  );
}

