/**
 * 역할: 버튼, 카드처럼 여러 화면에서 재사용하는 기본 UI 컴포넌트입니다.
 * 위치: src\components\primitives\MonthPicker.tsx
 */
import styled from "styled-components";
import { tokens } from "../../styles/tokens";
import { MONTH_OPTIONS } from "../../constants/months";

interface MonthPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const Wrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.space[2]};
`;

const StepButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.control};
  background: ${tokens.color.panel};
  color: ${tokens.color.ink2};
  cursor: pointer;
  font-size: 16px;
  transition:
    border-color ${tokens.motion.fast} ease,
    background ${tokens.motion.fast} ease,
    box-shadow ${tokens.motion.fast} ease;

  &:hover:not(:disabled) {
    border-color: ${tokens.color.accentBorder};
    background: ${tokens.color.foot};
  }

  &:focus-visible {
    box-shadow: ${tokens.shadow.focus};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  height: 32px;
  min-width: 132px;
  padding: 0 32px 0 12px;
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.control};
  background: ${tokens.color.panel};
  color: ${tokens.color.ink2};
  font-family: inherit;
  font-size: ${tokens.type.bodySm.size};
  font-weight: 500;
  outline: none;
  cursor: pointer;

  &:focus,
  &:focus-visible {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }
`;

export const MonthPicker = ({ value, onChange }: MonthPickerProps) => {
  const currentIndex = MONTH_OPTIONS.findIndex((option) => option.key === value);

  return (
    <Wrap>
      <StepButton
        type="button"
        onClick={() => onChange(MONTH_OPTIONS[currentIndex - 1].key)}
        disabled={currentIndex <= 0}
        aria-label="이전 달"
      >
        ‹
      </StepButton>
      <Select value={value} onChange={(event) => onChange(event.target.value)} aria-label="월 선택">
        {MONTH_OPTIONS.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </Select>
      <StepButton
        type="button"
        onClick={() => onChange(MONTH_OPTIONS[currentIndex + 1].key)}
        disabled={currentIndex >= MONTH_OPTIONS.length - 1}
        aria-label="다음 달"
      >
        ›
      </StepButton>
    </Wrap>
  );
};

