import React from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { LoginForm } from "./components/LoginForm";

export const LoginPage: React.FC = () => (
  <AuthLayout
    title="로그인"
    subtitle="계정에 로그인하고 지출·수입 내역을 관리하세요."
    footerPrompt="아직 계정이 없으신가요?"
    footerLabel="회원가입"
    footerHref="/register"
  >
    <LoginForm />
  </AuthLayout>
);
