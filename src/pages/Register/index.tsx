import React from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { RegisterForm } from "./components/RegisterForm";

export const RegisterPage: React.FC = () => (
  <AuthLayout
    title="회원가입"
    subtitle="30초면 충분해요. 이메일만 있으면 바로 시작할 수 있어요."
    footerPrompt="이미 계정이 있으신가요?"
    footerLabel="로그인"
    footerHref="/login"
  >
    <RegisterForm />
  </AuthLayout>
);
