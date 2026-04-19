import type { ButtonHTMLAttributes } from "react";
import styled from "styled-components";
import { tokens } from "../../styles/tokens";

interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
}

const StyledToggle = styled.button<{ $checked: boolean }>`
  position: relative;
  width: 40px;
  height: 22px;
  border: none;
  border-radius: 999px;
  background: ${({ $checked }) => ($checked ? tokens.color.accent : tokens.color.line)};
  cursor: pointer;
  flex: none;
  transition: background 0.16s;

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${({ $checked }) => ($checked ? "21px" : "3px")};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.15);
    transition: left 0.16s;
  }
`;

export const Toggle = ({ checked, type = "button", ...rest }: ToggleProps) => (
  <StyledToggle type={type} $checked={checked} {...rest} />
);
