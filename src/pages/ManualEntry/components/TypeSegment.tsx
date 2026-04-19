import React from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";

export type TxType = "expense" | "income";

const Wrap = styled.div`
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  background: ${tokens.color.tint};
  border-radius: 8px;
`;

const Seg = styled.button<{ $on?: boolean }>`
  padding: 7px 16px;
  border: none;
  border-radius: 6px;
  background: ${({ $on }) => ($on ? tokens.color.panel : "transparent")};
  color: ${({ $on }) => ($on ? tokens.color.ink1 : tokens.color.ink3)};
  box-shadow: ${({ $on }) => ($on ? "0 1px 2px rgba(16,24,40,.08)" : "none")};
  cursor: pointer;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
`;

export const TypeSegment: React.FC<{ value: TxType; onChange: (value: TxType) => void }> = ({
  value,
  onChange,
}) => (
  <Wrap>
    <Seg type="button" $on={value === "expense"} onClick={() => onChange("expense")}>
      지출
    </Seg>
    <Seg type="button" $on={value === "income"} onClick={() => onChange("income")}>
      수입
    </Seg>
  </Wrap>
);
