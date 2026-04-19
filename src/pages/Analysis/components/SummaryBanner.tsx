import React from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";

const Banner = styled.div`
  background: ${tokens.color.accentSubtle};
  border: 1px solid ${tokens.color.accentBorder};
  border-left: 3px solid ${tokens.color.accent};
  border-radius: ${tokens.radius.card};
  padding: 12px 16px;
  color: ${tokens.color.ink2};
  font-size: 12.5px;
  line-height: 1.6;
`;

export const SummaryBanner: React.FC<{ text: string }> = ({ text }) => (
  <Banner>
    <strong style={{ fontWeight: 600, marginRight: 6 }}>이번 달 요약</strong>
    {text}
  </Banner>
);
