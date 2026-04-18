import { useState } from "react";
import styled from "styled-components";
import { AppShell } from "../components/layout/AppShell";
import { Card, CardHeader } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import UploadDropzone from "../components/form/UploadDropzone";
import PlatformSelector from "../components/form/PlatformSelector";
import type { NavKey } from "../components/layout/AppShell";
import type { Platform } from "../types/platform";
import { formatKRW } from "../utils/format";

interface UploadedImage {
  id: string;
  name: string;
  url: string;
}

interface UploadPageProps {
  activeNav: NavKey;
  onNavChange: (key: NavKey) => void;
}

interface OcrSummary {
  productName: string;
  totalAmount: number;
  orderDate: string;
  platform: Platform;
}

const MOCK_SUMMARY: OcrSummary = {
  productName: "나이키 에어포스 1 로우 외 1건",
  totalAmount: 258000,
  orderDate: "2025.04.14",
  platform: "쿠팡",
};

const UPLOAD_GUIDE_TIPS = [
  "쿠팡 앱 → 마이쿠팡 → 주문내역 → 스크린샷 캡처",
  "네이버쇼핑 → MY → 구매내역 → 스크린샷 캡처",
  "무신사 → 마이페이지 → 주문/배송 → 스크린샷 캡처",
];

const Spacer = styled.div<{ $h?: number }>`
  height: ${({ $h = 8 }) => $h}px;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewBody = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
`;

const PreviewEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 20px;
  background: #f9fafb;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  text-align: center;

  .icon {
    font-size: 36px;
    margin-bottom: 10px;
    opacity: 0.7;
  }
  .label {
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
  }
  .desc {
    font-size: 11px;
    margin-top: 4px;
    color: #9ca3af;
  }
`;

const Thumb = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  aspect-ratio: 4 / 3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 5px 8px;
    background: rgba(0, 0, 0, 0.55);
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 500;
  }
  .remove {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 22px;
    height: 22px;
    border-radius: 11px;
    background: rgba(0, 0, 0, 0.6);
    color: #ffffff;
    border: none;
    font-size: 11px;
    line-height: 1;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.12s;

    &:hover {
      background: rgba(0, 0, 0, 0.8);
    }
  }
`;

const SummaryStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SummaryHighlight = styled.div`
  background: #eef4ff;
  border: 1px solid #dbe6fe;
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 11.5px;
    color: #4f6ef7;
    font-weight: 600;
    letter-spacing: 0.1px;
  }
  .value {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }
`;

const MetaList = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    flex-shrink: 0;
  }
  .value {
    font-size: 13.5px;
    color: #111827;
    font-weight: 600;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const InlineHint = styled.p`
  margin: 0;
  font-size: 11.5px;
  color: #9ca3af;
  text-align: center;
`;

const SummaryEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 20px;
  background: #f9fafb;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  text-align: center;

  .icon {
    font-size: 32px;
    margin-bottom: 10px;
    opacity: 0.6;
  }
  .label {
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
  }
  .desc {
    font-size: 11px;
    color: #9ca3af;
    margin-top: 4px;
  }
`;

const PlatformWrap = styled.div`
  margin-top: 4px;
`;

const AnalyzeBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AnalyzeHint = styled.span`
  font-size: 11.5px;
  color: #9ca3af;
  text-align: center;
`;

const GuideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const GuideItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #374151;
  line-height: 1.5;

  .check {
    color: #10b981;
    font-weight: 700;
    flex-shrink: 0;
  }
`;

const GuideWarn = styled.div`
  margin-top: 14px;
  padding: 12px 14px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  font-size: 12px;
  color: #92400e;
  line-height: 1.5;
`;

export const UploadPage = ({
  activeNav,
  onNavChange,
}: UploadPageProps) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [platform, setPlatform] = useState<Platform>("쿠팡");

  const hasImages = images.length > 0;

  const handleUpload = (files: File[] = []) => {
    if (!files.length) return;
    const start = images.length;
    const next: UploadedImage[] = files.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: `이미지 ${start + i + 1}`,
      url: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...next]);
  };

  const removeImage = (id: string) =>
    setImages((prev) => prev.filter((i) => i.id !== id));

  return (
    <AppShell
      activeNav={activeNav}
      title="주문내역 업로드"
      onNavChange={onNavChange}
    >
      <Card>
        <CardHeader
          title="이미지 업로드"
          subtitle="주문내역 캡처 이미지를 드래그하거나 선택해 업로드하세요"
        />
        <UploadDropzone onUpload={handleUpload} />
      </Card>

      <Spacer $h={4} />

      <TwoCol>
        <Card>
          <CardHeader
            title="이미지 미리보기"
            subtitle={
              hasImages
                ? `${images.length}장 업로드됨`
                : "업로드된 이미지가 없습니다"
            }
          />
          {hasImages ? (
            <PreviewBody>
              {images.map((img) => (
                <Thumb key={img.id}>
                  <img src={img.url} alt={img.name} />
                  <span className="label">{img.name}</span>
                  <button
                    type="button"
                    className="remove"
                    aria-label="이미지 삭제"
                    onClick={() => removeImage(img.id)}
                  >
                    ✕
                  </button>
                </Thumb>
              ))}
            </PreviewBody>
          ) : (
            <PreviewEmpty>
              <span className="icon">🖼</span>
              <span className="label">아직 업로드된 이미지가 없어요</span>
              <span className="desc">
                위 영역에 이미지를 업로드하면 여기에 표시됩니다
              </span>
            </PreviewEmpty>
          )}
        </Card>

        <Card>
          <CardHeader
            title="OCR 추출 결과 (요약)"
            subtitle={
              hasImages ? "자동 추출된 핵심 정보입니다" : "분석 대기 중"
            }
          />
          {hasImages ? (
            <SummaryStack>
              <SummaryHighlight>
                <span className="label">전체 결제금액</span>
                <span className="value">
                  {formatKRW(MOCK_SUMMARY.totalAmount)}
                </span>
              </SummaryHighlight>

              <MetaList>
                <MetaRow>
                  <span className="label">상품명</span>
                  <span className="value">{MOCK_SUMMARY.productName}</span>
                </MetaRow>
                <MetaRow>
                  <span className="label">주문일자</span>
                  <span className="value">{MOCK_SUMMARY.orderDate}</span>
                </MetaRow>
                <MetaRow>
                  <span className="label">플랫폼</span>
                  <span className="value">{MOCK_SUMMARY.platform}</span>
                </MetaRow>
              </MetaList>

              <InlineHint>
                전체 상품 목록 편집은 분석 후 진행됩니다
              </InlineHint>
            </SummaryStack>
          ) : (
            <SummaryEmpty>
              <span className="icon">🔍</span>
              <span className="label">아직 분석 결과가 없어요</span>
              <span className="desc">
                이미지를 업로드한 뒤 OCR 분석을 시작해주세요
              </span>
            </SummaryEmpty>
          )}
        </Card>
      </TwoCol>

      <Spacer $h={4} />

      <Card>
        <CardHeader
          title="플랫폼 선택"
          subtitle="이 주문이 이루어진 플랫폼을 선택하세요"
        />
        <PlatformWrap>
          <PlatformSelector value={platform} onChange={setPlatform} />
        </PlatformWrap>
      </Card>

      <Spacer $h={4} />

      <AnalyzeBar>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!hasImages}
        >
          🔍 OCR 분석 시작
        </Button>
        {!hasImages && (
          <AnalyzeHint>
            이미지를 먼저 업로드하면 분석을 시작할 수 있어요
          </AnalyzeHint>
        )}
      </AnalyzeBar>

      <Spacer $h={4} />

      <Card>
        <CardHeader
          title="업로드 가이드"
          subtitle="더 정확한 OCR을 위한 팁"
        />
        <GuideList>
          {UPLOAD_GUIDE_TIPS.map((tip, i) => (
            <GuideItem key={i}>
              <span className="check">✓</span>
              <span>{tip}</span>
            </GuideItem>
          ))}
        </GuideList>
        <GuideWarn>
          ⚠ 상품명, 가격, 날짜가 잘 보이도록 전체 화면을 캡처해주세요.
          OCR 인식률이 높아집니다.
        </GuideWarn>
      </Card>
    </AppShell>
  );
};