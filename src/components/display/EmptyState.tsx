/**
 * 역할: 상태 표시, 미리보기, 요약 카드처럼 정보를 보여주는 공통 컴포넌트입니다.
 * 위치: src\components\display\EmptyState.tsx
 */
import styled from "styled-components";
import { tokens } from "../../styles/tokens";

interface Props {
  title: string;
  description?: string;
}

const Wrap = styled.div`
  padding: 32px;
  text-align: center;
  color: ${tokens.color.ink3};
`;

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  color: ${tokens.color.ink2};
`;

const Desc = styled.div`
  font-size: 14px;
  color: ${tokens.color.ink3};
`;

export default function EmptyState({ title, description }: Props) {
  return (
    <Wrap>
      <Title>{title}</Title>
      {description && <Desc>{description}</Desc>}
    </Wrap>
  );
}

