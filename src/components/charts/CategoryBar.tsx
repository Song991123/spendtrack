/**
 * 역할: 차트 시각화를 작게 나눈 공통 그래프 컴포넌트입니다.
 * 위치: src\components\charts\CategoryBar.tsx
 */
import styled from "styled-components";
import { tokens } from "../../styles/tokens";

interface Props {
  percent: number;
}

const Wrap = styled.div`
  width: 100%;
  height: 8px;
  background: ${tokens.color.line2};
`;

const Fill = styled.div<{ $percent: number }>`
  height: 100%;
  background: ${tokens.color.accent};
  width: ${({ $percent }) => `${Math.max(0, Math.min(100, $percent))}%`};
`;

export default function CategoryBar({ percent }: Props) {
  return (
    <Wrap>
      <Fill $percent={percent} />
    </Wrap>
  );
}

