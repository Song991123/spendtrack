import type { InputHTMLAttributes } from "react";
import styled from "styled-components";
import { tokens } from "../../styles/tokens";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.control};
  background: ${tokens.color.panel};
  color: ${tokens.color.ink1};
  font-family: inherit;
  font-size: 13.5px;
  box-sizing: border-box;
  transition: border-color 0.12s, box-shadow 0.12s;

  &::placeholder {
    color: ${tokens.color.ink5};
  }

  &:focus {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
    outline: none;
  }
`;

export const TextInput = (props: TextInputProps) => <StyledInput {...props} />;
