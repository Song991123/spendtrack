/**
 * 역할: 버튼, 카드처럼 여러 화면에서 재사용하는 기본 UI 컴포넌트입니다.
 * 위치: src\components\primitives\TypingText.tsx
 */
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { tokens } from "../../styles/tokens";

interface TypingTextProps {
  text: string;
  speed?: number;
  caret?: boolean;
  className?: string;
  leadLength?: number;
  renderLead?: (text: string) => React.ReactNode;
  renderTail?: (text: string) => React.ReactNode;
}

const Caret = styled.span`
  display: inline-block;
  width: 1px;
  height: 1em;
  margin-left: 2px;
  background: ${tokens.color.accent};
  vertical-align: -2px;
  animation: blink 1s steps(1, end) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const TypingText: React.FC<TypingTextProps> = ({
  text,
  speed = 18,
  caret = true,
  className,
  leadLength = 0,
  renderLead,
  renderTail,
}) => {
  const [visibleText, setVisibleText] = useState("");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setVisibleText(text);
      return;
    }

    setVisibleText("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [reduceMotion, speed, text]);

  const isTyping = useMemo(() => visibleText.length < text.length, [text.length, visibleText.length]);
  const visibleLead = visibleText.slice(0, leadLength);
  const visibleTail = visibleText.slice(leadLength);

  return (
    <span className={className} aria-live={isTyping ? "off" : "polite"} aria-atomic="true">
      <span aria-hidden="true">
        {leadLength > 0 ? (
          <>
            {renderLead ? renderLead(visibleLead) : visibleLead}
            {renderTail ? renderTail(visibleTail) : visibleTail}
          </>
        ) : (
          visibleText
        )}
        {caret && isTyping && !reduceMotion && <Caret aria-hidden="true" />}
      </span>
      <SrOnly>{text}</SrOnly>
    </span>
  );
};

