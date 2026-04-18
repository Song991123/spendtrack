import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/primitives/Card";
import { media } from "../tokens/breakpoints";

const ContentWrapper = styled.div`
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${media.mobile} {
    max-width: 100%;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
`;

const EditLink = styled.button`
  font-size: 13px;
  font-weight: 500;
  color: #4f6ef7;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: #4f6ef7;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 11px;
  color: #9ca3af;
  font-weight: 400;
`;

const NameValue = styled.span`
  font-size: 14px;
  color: #111827;
  font-weight: 600;
`;

const InfoValue = styled.span`
  font-size: 13px;
  color: #111827;
  font-weight: 400;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  gap: 16px;

  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const SettingLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SettingLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #333333;
`;

const SettingDesc = styled.span`
  font-size: 11px;
  color: #9ca3af;
`;

const SettingRight = styled.div`
  flex-shrink: 0;

  ${media.mobile} {
    align-self: flex-start;
  }
`;

const SettingValue = styled.span`
  font-size: 13px;
  color: #4b5563;
`;

const SelectBox = styled.select`
  height: 36px;
  padding: 0 14px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 12px;
  color: #4b5563;
  background: #ffffff;
  cursor: pointer;
  min-width: 132px;
  font-family: inherit;
`;

const ToggleTrack = styled.button<{ $checked: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  cursor: pointer;
  background: ${({ $checked }) => ($checked ? "#4F6EF7" : "#D1D5DB")};
  position: relative;
  transition: background 0.2s ease;
  border: none;
  padding: 0;
`;

const ToggleThumb = styled.span<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background: #ffffff;
  position: absolute;
  top: 3px;
  left: ${({ $checked }) => ($checked ? "23px" : "3px")};
  transition: left 0.2s ease;
`;

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

const Toggle = ({ checked, onChange }: ToggleProps) => (
  <ToggleTrack type="button" $checked={checked} onClick={onChange}>
    <ToggleThumb $checked={checked} />
  </ToggleTrack>
);

const SecondaryBtn = styled.button`
  height: 32px;
  padding: 0 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #4b5563;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 16px 0;
`;

const LogoutButton = styled.button`
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: #f2f4f8;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
`;

const DangerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DangerLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DangerLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #e54d4d;
`;

const DangerLink = styled.button`
  font-size: 12px;
  font-weight: 500;
  color: #e54d4d;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
`;

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [defaultMonth, setDefaultMonth] = useState("auto");
  const [recurringAlert, setRecurringAlert] = useState(true);
  const [insightEnabled, setInsightEnabled] = useState(true);

  return (
    <AppShell activeNav="settings" title="내 계정 설정">
      <ContentWrapper>
        <Card padding={24}>
          <SectionHeader>
            <SectionTitle>프로필 정보</SectionTitle>
            <EditLink type="button">프로필 수정</EditLink>
          </SectionHeader>

          <ProfileRow>
            <Avatar>홍</Avatar>
            <ProfileInfo>
              <InfoLabel>이름</InfoLabel>
              <NameValue>홍길동</NameValue>
            </ProfileInfo>
          </ProfileRow>

          <FieldRow style={{ marginTop: 20 }}>
            <InfoLabel>이메일</InfoLabel>
            <InfoValue>hong@example.com</InfoValue>
          </FieldRow>
        </Card>

        <Card padding={24}>
          <SectionTitle style={{ marginBottom: 16 }}>계정 설정</SectionTitle>

          <SettingRow>
            <SettingLeft>
              <SettingLabel>기본 월 선택</SettingLabel>
              <SettingDesc>
                대시보드에서 기본으로 표시할 월을 설정합니다
              </SettingDesc>
            </SettingLeft>
            <SettingRight>
              <SelectBox
                value={defaultMonth}
                onChange={(event) => setDefaultMonth(event.target.value)}
              >
                <option value="auto">이번 달 (자동)</option>
                <option value="2025-04">2025년 4월</option>
                <option value="2025-03">2025년 3월</option>
              </SelectBox>
            </SettingRight>
          </SettingRow>

          <SettingRow>
            <SettingLeft>
              <SettingLabel>통화 표시</SettingLabel>
            </SettingLeft>
            <SettingRight>
              <SettingValue>₩ KRW (원)</SettingValue>
            </SettingRight>
          </SettingRow>
        </Card>

        <Card padding={24}>
          <SectionTitle style={{ marginBottom: 16 }}>알림 설정</SectionTitle>

          <SettingRow>
            <SettingLeft>
              <SettingLabel>정기결제 감지 알림</SettingLabel>
              <SettingDesc>
                새로운 정기결제가 감지되면 알려드려요
              </SettingDesc>
            </SettingLeft>
            <SettingRight>
              <Toggle
                checked={recurringAlert}
                onChange={() => setRecurringAlert(!recurringAlert)}
              />
            </SettingRight>
          </SettingRow>

          <SettingRow>
            <SettingLeft>
              <SettingLabel>소비 인사이트 표시</SettingLabel>
              <SettingDesc>
                홈 화면에 소비 패턴 인사이트를 표시합니다
              </SettingDesc>
            </SettingLeft>
            <SettingRight>
              <Toggle
                checked={insightEnabled}
                onChange={() => setInsightEnabled(!insightEnabled)}
              />
            </SettingRight>
          </SettingRow>
        </Card>

        <Card padding={24}>
          <SectionTitle style={{ marginBottom: 16 }}>
            보안 및 계정 관리
          </SectionTitle>

          <SettingRow>
            <SettingLeft>
              <SettingLabel>비밀번호 변경</SettingLabel>
              <SettingDesc>마지막 변경: 2025.03.10</SettingDesc>
            </SettingLeft>
            <SettingRight>
              <SecondaryBtn type="button">변경하기</SecondaryBtn>
            </SettingRight>
          </SettingRow>

          <Divider />

          <LogoutButton type="button" onClick={() => navigate("/login")}>
            로그아웃
          </LogoutButton>

          <Divider />

          <DangerRow>
            <DangerLeft>
              <DangerLabel>회원탈퇴</DangerLabel>
              <SettingDesc>
                탈퇴 시 모든 거래 내역과 OCR 데이터가 삭제됩니다
              </SettingDesc>
            </DangerLeft>
            <DangerLink type="button">탈퇴하기 →</DangerLink>
          </DangerRow>
        </Card>
      </ContentWrapper>
    </AppShell>
  );
};
