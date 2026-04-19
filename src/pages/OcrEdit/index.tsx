/**
 * 역할: 해당 화면의 상태와 레이아웃을 조립하는 페이지 진입 파일입니다.
 * 위치: src\pages\OcrEdit\index.tsx
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { Button } from "../../components/primitives/Button";
import { media } from "../../tokens/breakpoints";
import { ImageList } from "./components/ImageList";
import { ImagePreview } from "./components/ImagePreview";
import { EditForm } from "./components/EditForm";
import { ocrEditMockData, type OcrImageItem } from "./data";

const Body = styled.div`
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr) 380px;
  gap: 16px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;

  ${media.mobile} {
    flex-direction: column-reverse;
  }
`;

export const OcrEditPage: React.FC = () => {
  const navigate = useNavigate();
  const data = ocrEditMockData;
  // 좌측 목록에서 선택한 이미지에 따라 가운데 미리보기와 우측 수정 폼이 함께 바뀝니다.
  const [selectedId, setSelectedId] = useState<string>(data.images[0].id);
  const selected: OcrImageItem | undefined = data.images.find((image) => image.id === selectedId);

  return (
    <AppShell activeNav="upload" crumb="입력 · OCR" title="OCR 결과 확인 및 수정">
      <Body>
        {/* OCR 편집 화면은 목록, 미리보기, 수정 폼의 3단 구성을 사용합니다. */}
        <ImageList
          images={data.images}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={() => navigate("/ocr-upload")}
        />
        <ImagePreview image={selected} />
        <EditForm image={selected} />
      </Body>
      <Footer>
        <Button variant="ghost" size="lg" onClick={() => navigate("/ocr-upload")}>
          다시 OCR 분석
        </Button>
        <Button variant="primary" size="lg" onClick={() => navigate("/transactions")}>
          저장
        </Button>
      </Footer>
    </AppShell>
  );
};

