/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Analysis\components\SummaryBanner.tsx
 */
import React from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";

interface SummaryBannerProps {
  title: string;
  /**
   * 본문. 문자열 안에서 `**강조**` 구간은 볼드 + 진한 색상으로 표시됩니다.
   * 레퍼런스 HTML의 <b> 마크업과 동일한 역할을 합니다.
   */
  text: string;
}

const Banner = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: ${tokens.color.accentSubtle};
  border: 1px solid ${tokens.color.accentBorder};
  border-left: 3px solid ${tokens.color.accent};
  border-radius: ${tokens.radius.card};
  padding: ${tokens.space[3]} ${tokens.space[4]};
  color: ${tokens.color.ink2};
  font-size: ${tokens.type.bodySm.size};
  line-height: 1.7;
`;

const Icon = styled.svg`
  flex: none;
  margin-top: 3px;
  color: ${tokens.color.accent};
`;

const Title = styled.b`
  color: ${tokens.color.ink1};
  font-weight: 600;
`;

const Strong = styled.b`
  color: ${tokens.color.ink1};
  font-weight: 600;
`;

/**
 * `**...**` 구간을 Strong 컴포넌트로 렌더링합니다. 데이터 쪽에서는
 * 마크다운처럼 짧게 표기하고, 여기서만 JSX로 변환해 사용합니다.
 */
function renderSegments(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <Strong key={index}>{part.slice(2, -2)}</Strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export const SummaryBanner: React.FC<SummaryBannerProps> = ({ title, text }) => (
  <Banner>
    <Icon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v4" />
      <path d="M8 11h.01" />
    </Icon>
    <div>
      <Title>{title}</Title> · {renderSegments(text)}
    </div>
  </Banner>
);
