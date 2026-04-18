import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FormField } from "../components/form/FormField";
import { TextInput } from "../components/form/TextInput";
import { Button } from "../components/primitives/Button";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f2f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  padding: 24px;
`;

const Card = styled.div`
  width: 480px;
  max-width: 100%;
  padding: 40px;
  background: #ffffff;
  border-radius: 20px;
  box-sizing: border-box;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const LogoMark = styled.div`
  width: 36px;
  height: 36px;
  background: #4f6ef7;
  border-radius: 10px;
`;

const LogoText = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
`;

const Subtitle = styled.p`
  margin: 0 0 36px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #808080;
`;

const FieldSection = styled.div`
  margin-bottom: 16px;
`;

const PasswordConfirmSection = styled.div`
  margin-bottom: 24px;
`;

const ActionSection = styled.div`
  margin-bottom: 12px;
`;

const TermsText = styled.p`
  margin: 0 0 20px;
  text-align: center;
  font-size: 11px;
  color: #aaaaaa;
`;

const Divider = styled.div`
  height: 1px;
  background: #ebebeb;
  margin-bottom: 20px;
`;

const LoginLink = styled.button`
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #4f6ef7;
  cursor: pointer;
  font-family: inherit;
`;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  return (
    <PageWrapper>
      <Card>
        <LogoRow>
          <LogoMark />
          <LogoText>SpendTrack</LogoText>
        </LogoRow>

        <Subtitle>새 계정 만들기</Subtitle>

        <FieldSection>
          <FormField label="이메일">
            <TextInput
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
        </FieldSection>

        <FieldSection>
          <FormField label="비밀번호">
            <TextInput
              type="password"
              placeholder="8자 이상 영문, 숫자 포함"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
        </FieldSection>

        <PasswordConfirmSection>
          <FormField label="비밀번호 확인">
            <TextInput
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </FormField>
        </PasswordConfirmSection>

        <ActionSection>
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate("/")}>
            회원가입
          </Button>
        </ActionSection>

        <TermsText>가입 시 서비스 이용약관 및 개인정보 처리방침에 동의합니다.</TermsText>

        <Divider />

        <LoginLink type="button" onClick={() => navigate("/login")}>
          이미 계정이 있으신가요? 로그인 →
        </LoginLink>
      </Card>
    </PageWrapper>
  );
};
