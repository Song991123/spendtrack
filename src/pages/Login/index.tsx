import React from "react";
import styled from "styled-components";
import { tokens } from "../../styles/tokens";
import { AuthCard } from "./components/AuthCard";
import { LoginForm } from "./components/LoginForm";
import { AuthFooter } from "./components/AuthFooter";

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

export const LoginPage: React.FC = () => (
  <Page>
    <div style={{ width: 400, maxWidth: "100%" }}>
      <Brand>
        <div className="logo">S</div>
        <div className="name">SpendTrack</div>
      </Brand>
      <AuthCard title="로그인" subtitle="계정에 로그인하고 지출·수입 내역을 관리하세요">
        <LoginForm />
      </AuthCard>
      <AuthFooter prompt="아직 계정이 없으신가요?" linkLabel="회원가입" linkHref="/register" />
    </div>
  </Page>
);
