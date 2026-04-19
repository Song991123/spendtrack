/**
 * 역할: 입력 흐름에서 재사용하는 폼 관련 공통 컴포넌트입니다.
 * 위치: src\components\form\FilterPill.tsx
 */
import styled from "styled-components";

interface Props {
  label: string;
}

const Pill = styled.button`
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  background: #f3f4f6;
  cursor: pointer;
`;

export default function FilterPill({ label }: Props) {
  return <Pill>{label}</Pill>;
}
