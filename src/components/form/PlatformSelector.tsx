/**
 * 역할: 입력 흐름에서 재사용하는 폼 관련 공통 컴포넌트입니다.
 * 위치: src\components\form\PlatformSelector.tsx
 */
import styled from "styled-components";
import { PLATFORMS } from "../../types/platform";
import type { Platform } from "../../types/platform";
import { tokens } from "../../styles/tokens";

interface Props {
  value: Platform;
  onChange: (value: Platform) => void;
}

const Select = styled.select`
  height: 40px;
  padding: 0 12px;
  border-radius: ${tokens.radius.controlLg};
  border: 1px solid ${tokens.color.line};
  font-size: ${tokens.type.bodySm.size};
  transition: border-color ${tokens.motion.fast}, box-shadow ${tokens.motion.fast};

  &:focus,
  &:focus-visible {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
    outline: none;
  }
`;

export default function PlatformSelector({ value, onChange }: Props) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value as Platform)}>
      {PLATFORMS.map((platform) => (
        <option key={platform} value={platform}>
          {platform}
        </option>
      ))}
    </Select>
  );
}

