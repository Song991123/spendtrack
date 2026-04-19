/**
 * 역할: 입력 흐름에서 재사용하는 폼 관련 공통 컴포넌트입니다.
 * 위치: src\components\form\SearchInput.tsx
 */
import styled from "styled-components";
import { tokens } from "../../styles/tokens";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Input = styled.input`
  height: 40px;
  padding: 0 12px;
  border-radius: ${tokens.radius.controlLg};
  border: 1px solid ${tokens.color.line};
  width: 100%;
  font-size: ${tokens.type.bodySm.size};
  transition: border-color ${tokens.motion.fast}, box-shadow ${tokens.motion.fast};

  &:focus,
  &:focus-visible {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
    outline: none;
  }
`;

export default function SearchInput({
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <Input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

