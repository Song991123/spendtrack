import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FormField } from "../components/form/FormField";
import { TextInput } from "../components/form/TextInput";
import { Button } from "../components/primitives/Button";
import { media } from "../tokens/breakpoints";

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

  ${media.mobile} {
    width: calc(100% - 32px);
    max-width: 480px;
    padding: 32px 24px;
  }
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

const Tagline = styled.p`
  margin: 0 0 40px;
  text-align: center;
  font-size: 13px;
  color: #808080;
`;

const FieldSection = styled.div`
  margin-bottom: 16px;
`;

const PasswordSection = styled.div`
  margin-bottom: 24px;
`;

const ActionSection = styled.div`
  margin-bottom: 12px;
`;

const TextButton = styled.button<{ $align?: "left" | "center" | "right"; $color?: string }>`
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  text-align: ${({ $align = "center" }) => $align};
  color: ${({ $color = "#808080" }) => $color};
  cursor: pointer;
  font-family: inherit;
`;

const PasswordHelp = styled(TextButton)`
  margin-bottom: 20px;
  font-size: 12px;
`;

const Divider = styled.div`
  height: 1px;
  background: #ebebeb;
  margin-bottom: 20px;
`;

const RegisterLink = styled(TextButton)`
  margin-bottom: 32px;
  font-size: 13px;
  font-weight: 500;
  color: #4f6ef7;
`;

const FooterText = styled.p`
  margin: 0;
  text-align: center;
  font-size: 11px;
  color: #aaaaaa;
`;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <PageWrapper>
      <Card>
        <LogoRow>
          <LogoMark />
          <LogoText>SpendTrack</LogoText>
        </LogoRow>

        <Tagline>주문 캡처 한 장으로 시작하는 소비관리</Tagline>

        <FieldSection>
          <FormField label="이메일">
            <TextInput
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
        </FieldSection>

        <PasswordSection>
          <FormField label="비밀번호">
            <TextInput
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
        </PasswordSection>

        <ActionSection>
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate("/")}>
            로그인
          </Button>
        </ActionSection>

        <PasswordHelp type="button" $align="right">
          비밀번호 찾기
        </PasswordHelp>

        <Divider />

        <RegisterLink type="button" onClick={() => navigate("/register")}>
          계정이 없으신가요? 회원가입 →
        </RegisterLink>

        <FooterText>쇼핑 주문내역을 캡처하면 자동으로 가계부가 됩니다</FooterText>
      </Card>
    </PageWrapper>
  );
};
