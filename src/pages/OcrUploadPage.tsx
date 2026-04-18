import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../components/layout/AppShell";
import { Tag } from "../components/primitives/Tag";
import { Button } from "../components/primitives/Button";
import { Card } from "../components/primitives/Card";

const StepBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const StepPill = styled.span<{ $active?: boolean }>`
  border-radius: 13px;
  padding: 6px 20px;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  background: ${({ $active }) => ($active ? "#4F6EF7" : "transparent")};
  color: ${({ $active }) => ($active ? "#FFFFFF" : "#6B7280")};
`;

const Arrow = styled.span`
  color: #9ca3af;
  font-size: 13px;
`;

const GuideTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
`;

const GuideList = styled.div`
  font-size: 12px;
  color: #4b5563;
  line-height: 2;
`;

const SectionLabel = styled.h3`
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
`;

const PlatformRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const PlatformBtn = styled.button<{ $active?: boolean }>`
  height: 36px;
  padding: 0 28px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  background: ${({ $active }) => ($active ? "#4F6EF7" : "#FFFFFF")};
  color: ${({ $active }) => ($active ? "#FFFFFF" : "#374151")};
  border: ${({ $active }) => ($active ? "none" : "1px solid #D1D5DB")};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
`;

const DropCard = styled(Card)`
  text-align: center;
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #eef4ff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #4f6ef7;
  font-weight: 700;
  margin: 0 auto 16px;
`;

const DropTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`;

const DropDesc = styled.p`
  margin: 0 0 20px;
  font-size: 12px;
  color: #9ca3af;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ThumbRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ThumbSlot = styled.div`
  width: 160px;
  height: 120px;
  background: #f3f4f6;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
`;

const ImageCount = styled.p`
  margin: 16px 0 0;
  font-size: 12px;
  color: #6b7280;
  text-align: center;
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`;

const PreviewTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
`;

const PreviewSub = styled.span`
  font-size: 11px;
  color: #9ca3af;
`;

const InfoRowWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
`;

const InfoLabel = styled.span`
  font-size: 11px;
  color: #9ca3af;
`;

const InfoValue = styled.span<{ $bold?: boolean }>`
  font-size: 13px;
  font-weight: ${({ $bold }) => ($bold ? 600 : 400)};
  color: #111827;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 12px 0;
`;

const SmallTwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const HiddenInput = styled.input`
  display: none;
`;

const InfoRow = ({
  label,
  value,
  bold,
}: {
  label: string;
  value?: string;
  bold?: boolean;
}) => (
  <InfoRowWrap>
    <InfoLabel>{label}</InfoLabel>
    {value && <InfoValue $bold={bold}>{value}</InfoValue>}
  </InfoRowWrap>
);

export const OcrUploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("쿠팡");

  return (
    <AppShell activeNav="upload" title="OCR 업로드">
      <StepBar>
        <StepPill $active>① 이미지 업로드</StepPill>
        <Arrow>→</Arrow>
        <StepPill>② OCR 분석</StepPill>
        <Arrow>→</Arrow>
        <StepPill>③ 상품별 확인/수정</StepPill>
      </StepBar>

      <Card padding={24} style={{ marginBottom: 16 }}>
        <GuideTitle>업로드 가이드</GuideTitle>
        <GuideList>
          • 주문 완료 화면을 캡처해 주세요 (상품명, 금액, 날짜가 보이도록)
          <br />
          • 한 장에 여러 상품이 포함되어도 자동 분리됩니다
          <br />
          • 플랫폼을 먼저 선택하면 OCR 정확도가 높아집니다
        </GuideList>
      </Card>

      <Card padding={24} style={{ marginBottom: 16 }}>
        <SectionLabel>플랫폼 선택</SectionLabel>
        <PlatformRow>
          {["쿠팡", "네이버쇼핑", "무신사"].map((platform) => (
            <PlatformBtn
              key={platform}
              type="button"
              $active={selectedPlatform === platform}
              onClick={() => setSelectedPlatform(platform)}
            >
              {platform}
            </PlatformBtn>
          ))}
        </PlatformRow>
      </Card>

      <DropCard padding="48px 32px" style={{ marginBottom: 16 }}>
        <UploadIcon>↑</UploadIcon>
        <DropTitle>여러 장의 주문내역 캡처를 한 번에 업로드하세요</DropTitle>
        <DropDesc>PNG, JPG, WEBP · 최대 10MB · 한 번에 5장까지 동시 분석</DropDesc>
        <Button
          variant="primary"
          size="md"
          onClick={() => fileInputRef.current?.click()}
        >
          파일 선택하기
        </Button>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
        />
      </DropCard>

      <TwoCol>
        <Card padding={20}>
          <ThumbRow>
            {[0, 1, 2].map((slot) => (
              <ThumbSlot key={slot} />
            ))}
          </ThumbRow>
          <ImageCount>업로드된 이미지 (0/5)</ImageCount>
        </Card>

        <Card padding={20}>
          <PreviewHeader>
            <PreviewTitle>OCR 분석 미리보기</PreviewTitle>
            <PreviewSub>상세 편집은 다음 단계에서</PreviewSub>
          </PreviewHeader>

          <InfoRow label="상품명" value="나이키 에어포스 1 로우" bold />
          <Divider />
          <InfoRow label="결제금액" value="₩129,000" bold />
          <SmallTwoCol>
            <InfoRow label="주문일자" value="2025.04.14" bold />
            <InfoRow label="플랫폼명" value={selectedPlatform} bold />
          </SmallTwoCol>
          <InfoRow label="OCR 감지 상태" />
          <TagRow>
            <Tag variant="status" value="구매" />
            <Tag variant="status" value="정기결제" />
          </TagRow>
        </Card>
      </TwoCol>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={() => navigate("/ocr-edit")}
      >
        분석하고 수정 단계로 이동 →
      </Button>
    </AppShell>
  );
};
