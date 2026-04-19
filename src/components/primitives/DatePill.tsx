import type { ButtonHTMLAttributes } from "react";
import styled from "styled-components";
import { tokens } from "../../styles/tokens";

type DatePillProps = ButtonHTMLAttributes<HTMLButtonElement>;

const StyledDatePill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid ${tokens.color.line};
  background: ${tokens.color.panel};
  border-radius: ${tokens.radius.control};
  color: ${tokens.color.ink2};
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${tokens.color.accent};
  }
`;

export const DatePill = ({ type = "button", children, ...rest }: DatePillProps) => (
  <StyledDatePill type={type} {...rest}>
    <span className="dot" />
    {children}
  </StyledDatePill>
);
