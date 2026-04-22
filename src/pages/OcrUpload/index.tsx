/**
 * 역할: 해당 화면의 상태와 레이아웃을 조립하는 페이지 진입 파일입니다.
 * 위치: src\pages\OcrUpload\index.tsx
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { Button } from "../../components/primitives/Button";
import { tokens } from "../../styles/tokens";
import { PlatformSelect, type Platform } from "./components/PlatformSelect";
import { UploadZone } from "./components/UploadZone";
import { UploadedGrid } from "./components/UploadedGrid";
import { GuideCard } from "./components/GuideCard";
import { ocrUploadMockData, type UploadedImage } from "./data";

const Wrap = styled.div`
  display: grid;
  gap: 16px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 4px;

  .count {
    color: ${tokens.color.ink4};
    font-size: 12px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

export const OcrUploadPage: React.FC = () => {
  const navigate = useNavigate();
  // 플랫폼 값은 업로드 예시 파일 이름과 안내 문구에 함께 반영됩니다.
  const [platform, setPlatform] = useState<Platform>("coupang");
  const [images, setImages] = useState<UploadedImage[]>(ocrUploadMockData.images);

  const handleRemove = (id: string) => {
    setImages((current) => current.filter((image) => image.id !== id));
  };

  const handleAddMock = () => {
    setImages((current) => {
      // v1 데모에서는 실제 파일 대신 목업 썸네일 행을 추가해 흐름만 검증합니다.
      if (current.length >= 5) {
        return current;
      }

      const nextIndex = current.length + 1;
      return [
        ...current,
        {
          id: `mock-${Date.now()}`,
          thumbUrl: "",
          fileName: `${platform}-capture-${nextIndex}.png`,
          sizeLabel: `${(0.8 + nextIndex * 0.2).toFixed(1)} MB`,
          status: "ready",
        },
      ];
    });
  };

  return (
    <AppShell activeNav="upload" crumb="입력 · OCR" title="OCR 업로드">
      <Wrap>
        <GuideCard items={ocrUploadMockData.guide} />
        <PlatformSelect value={platform} onChange={setPlatform} />
        {/* 업로드 영역과 업로드된 목록을 분리해 실제 서비스 구조를 미리 보여 줍니다. */}
        {/* data-tour: ProductTour 스포트라이트 타겟. */}
        <div data-tour="ocr-zone">
          <UploadZone
            acceptedTypes="PNG, JPG, WEBP"
            maxSize="10MB"
            maxCount={5}
            onPick={handleAddMock}
          />
        </div>

        {images.length > 0 && <UploadedGrid images={images} onRemove={handleRemove} />}

        <Footer>
          <span className="count">업로드한 이미지 {images.length}/5</span>
          <Actions>
            <Button variant="ghost" size="lg" onClick={() => navigate("/upload")}>
              취소
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={images.length === 0}
              onClick={() => navigate("/ocr-edit")}
            >
              분석 시작하기
            </Button>
          </Actions>
        </Footer>
      </Wrap>
    </AppShell>
  );
};

