import React from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";

export type StatusKey = "purchase" | "sub" | "subscription" | "refund" | "cancel";

const LIST: { key: StatusKey; label: string }[] = [
  { key: "purchase", label: "구매" },
  { key: "sub", label: "정기결제" },
  { key: "subscription", label: "구독" },
  { key: "refund", label: "환불" },
  { key: "cancel", label: "취소" },
];

const Row = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Chip = styled.button<{ $on?: boolean }>`
  padding: 5px 12px;
  border: 1px solid ${({ $on }) => ($on ? tokens.color.accentBorder : tokens.color.line)};
  border-radius: 6px;
  background: ${({ $on }) => ($on ? tokens.color.accentSubtle : tokens.color.panel)};
  color: ${({ $on }) => ($on ? tokens.color.accentHover : tokens.color.ink2)};
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.12s;
`;

export const StatusTags: React.FC<{
  value: StatusKey | null;
  onChange: (value: StatusKey | null) => void;
}> = ({ value, onChange }) => (
  <Row>
    {LIST.map((status) => (
      <Chip
        key={status.key}
        type="button"
        $on={value === status.key}
        onClick={() => onChange(value === status.key ? null : status.key)}
      >
        {status.label}
      </Chip>
    ))}
  </Row>
);
