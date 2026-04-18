import type { InputHTMLAttributes } from "react";
import styled from "styled-components";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

const StyledInput = styled.input`
  height: 44px;
  padding: 0 16px;
  border: 1px solid #D9D9D9;
  border-radius: 10px;
  font-size: 13px;
  color: #111827;
  background: #FFFFFF;
  font-family: inherit;
  box-sizing: border-box;
  width: 100%;

  &::placeholder {
    color: #B0B0B0;
  }

  &:focus {
    border-color: #4F6EF7;
    outline: none;
  }
`;

export const TextInput = (props: TextInputProps) => <StyledInput {...props} />;
