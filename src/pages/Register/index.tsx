import React from "react";
import styled from "styled-components";
import { tokens } from "../../styles/tokens";
import { AuthCard } from "../Login/components/AuthCard";
import { AuthFooter } from "../Login/components/AuthFooter";
import { RegisterForm } from "./components/RegisterForm";

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 16px;
  background: ${tokens.color.bg};
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;

  .logo {
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    border-radius: 8px;
    background: ${tokens.color.accent};
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .name {
    color: ${tokens.color.ink1};
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
`;

export const RegisterPage: React.FC = () => (
  <Page>
    <div style={{ width: 420, maxWidth: "100%" }}>
      <Brand>
        <div className="logo">S</div>
        <div className="name">SpendTrack</div>
      </Brand>
      <AuthCard title="회원가입" subtitle="30초면 충분해요. 이메일만 있으면 시작할 수 있어요.">
        <RegisterForm />
      </AuthCard>
      <AuthFooter prompt="이미 계정이 있으신가요?" linkLabel="로그인" linkHref="/login" />
    </div>
  </Page>
);
