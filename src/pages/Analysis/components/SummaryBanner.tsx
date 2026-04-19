/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Analysis\components\SummaryBanner.tsx
 */
import React, { useMemo } from "react";
import styled from "styled-components";
import { TypingText } from "../../../components/primitives/TypingText";
import { tokens } from "../../../styles/tokens";

interface SummaryBannerProps {
  title: string;
  text: string;
}

const Banner = styled.div`
  background: ${tokens.color.accentSubtle};
  border: 1px solid ${tokens.color.accentBorder};
  border-left: 3px solid ${tokens.color.accent};
  border-radius: ${tokens.radius.card};
  padding: ${tokens.space[3]} ${tokens.space[4]};
  color: ${tokens.color.ink2};
  font-size: ${tokens.type.bodySm.size};
  line-height: 1.7;
`;

const Title = styled.strong`
  display: inline-block;
  margin-right: 6px;
  font-weight: 600;
`;

export const SummaryBanner: React.FC<SummaryBannerProps> = ({ title, text }) => {
  const fullText = useMemo(() => `${title} ${text}`, [title, text]);

  return (
    <Banner>
      <TypingText
        text={fullText}
        speed={18}
        caret
        leadLength={title.length}
        renderLead={(lead) => <Title>{lead}</Title>}
        renderTail={(tail) => tail}
      />
    </Banner>
  );
};

