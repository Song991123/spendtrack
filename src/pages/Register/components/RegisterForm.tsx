import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button } from "../../../components/primitives/Button";
import { tokens } from "../../../styles/tokens";
import { PasswordStrength } from "./PasswordStrength";

const Field = styled.div`
  margin-bottom: 14px;

  label {
    display: block;
    margin-bottom: 6px;
    color: ${tokens.color.ink2};
    font-size: 12px;
    font-weight: 600;
  }

  .hint {
    margin-top: 6px;
    color: ${tokens.color.ink4};
    font-size: 11.5px;
  }

  input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${tokens.color.line};
    border-radius: 8px;
    background: ${tokens.color.panel};
    color: ${tokens.color.ink1};
    font-family: inherit;
    font-size: 13.5px;
    outline: none;
    transition: border-color 0.12s, box-shadow 0.12s;
  }

  input:focus {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }

  input::placeholder {
    color: ${tokens.color.ink5};
  }
`;

const Agree = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 8px 0 18px;
  color: ${tokens.color.ink3};
  cursor: pointer;
  font-size: 12.5px;
  line-height: 1.5;

  input {
    margin-top: 2px;
    accent-color: ${tokens.color.accent};
  }

  a {
    color: ${tokens.color.accentHover};
    font-weight: 600;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const RegisterForm: React.FC = () => {
  const [password, setPassword] = useState("");

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Field>
        <label>이름</label>
        <input placeholder="홍길동" autoComplete="name" />
      </Field>
      <Field>
        <label>이메일</label>
        <input type="email" placeholder="you@example.com" autoComplete="email" />
      </Field>
      <Field>
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="8자 이상, 숫자 포함"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordStrength value={password} />
      </Field>
      <Agree>
        <input type="checkbox" />
        <span>
          <Link to="/register">이용약관</Link>과 <Link to="/register">개인정보 처리방침</Link>에
          동의합니다. (필수)
        </span>
      </Agree>
      <Button variant="primary" size="lg" block type="submit">
        계정 만들기
      </Button>
    </form>
  );
};
