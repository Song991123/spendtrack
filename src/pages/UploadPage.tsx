import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";

const CenteredArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
`;

const Heading = styled.h2`
  margin: 0 0 40px;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  text-align: center;
`;

const CardRow = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  max-width: 900px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const ChoiceCard = styled(Card)`
  flex: 1;
  padding: 48px 32px;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 40px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

const CardDesc = styled.p`
  margin: 0 0 28px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  white-space: pre-line;
`;

const SubNote = styled.p`
  margin: 16px 0 0;
  font-size: 11px;
  color: #9ca3af;
`;

export const UploadPage = () => {
  const navigate = useNavigate();

  return (
    <AppShell activeNav="upload" title="내역 입력">
      <CenteredArea>
        <Heading>어떤 방법으로 내역을 입력하시겠어요?</Heading>

        <CardRow>
          <ChoiceCard padding="48px 32px">
            <Icon>📷</Icon>
            <CardTitle>OCR로 입력</CardTitle>
            <CardDesc>
              쇼핑몰 주문내역 캡처를 인식해
              {"\n"}자동으로 입력합니다.
            </CardDesc>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate("/ocr-upload")}
            >
              OCR 업로드 시작 →
            </Button>
            <SubNote>취소·반품·환불·정기결제도 자동 감지</SubNote>
          </ChoiceCard>

          <ChoiceCard padding="48px 32px">
            <Icon>✏️</Icon>
            <CardTitle>수동 입력</CardTitle>
            <CardDesc>
              지출/수입 내역을 직접
              {"\n"}기록할 수 있습니다.
            </CardDesc>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => navigate("/manual-entry")}
            >
              직접 입력 시작 →
            </Button>
            <SubNote>상품 추가는 팝업으로 간편하게</SubNote>
          </ChoiceCard>
        </CardRow>
      </CenteredArea>
    </AppShell>
  );
};
