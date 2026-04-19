import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../../components/primitives/Button";
import { tokens } from "../../../styles/tokens";

const Field = styled.div`
  margin-bottom: 14px;

  label {
    display: block;
    margin-bottom: 6px;
    color: ${tokens.color.ink2};
    font-size: 12px;
    font-weight: 600;
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

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 14px 0 18px;
  font-size: 12.5px;
`;

const Remember = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${tokens.color.ink3};
  cursor: pointer;

  input {
    accent-color: ${tokens.color.accent};
  }
`;

const ForgotLink = styled(Link)`
  color: ${tokens.color.accentHover};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const LoginForm: React.FC = () => (
  <form onSubmit={(event) => event.preventDefault()}>
    <Field>
      <label>이메일</label>
      <input type="email" placeholder="you@example.com" autoComplete="email" />
    </Field>
    <Field>
      <label>비밀번호</label>
      <input type="password" placeholder="••••••••" autoComplete="current-password" />
    </Field>
    <Row>
      <Remember>
        <input type="checkbox" /> 로그인 상태 유지
      </Remember>
      <ForgotLink to="/login">비밀번호를 잊으셨나요?</ForgotLink>
    </Row>
    <Button variant="primary" size="lg" block type="submit">
      로그인
    </Button>
  </form>
);
