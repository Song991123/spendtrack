import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../../components/primitives/Button";
import { FormField } from "../../../components/form/FormField";
import { TextInput } from "../../../components/form/TextInput";
import { tokens } from "../../../styles/tokens";

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 14px 0 18px;
  font-size: 12.5px;
  gap: 12px;
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

const PasswordInput = styled(TextInput)`
  letter-spacing: 0.08em;
`;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        navigate("/");
      }}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <FormField label="이메일">
          <TextInput type="email" placeholder="you@example.com" autoComplete="email" />
        </FormField>
        <FormField label="비밀번호">
          <PasswordInput
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </FormField>
      </div>
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
};
