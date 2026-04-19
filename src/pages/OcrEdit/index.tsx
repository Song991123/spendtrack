import React, { useState } from "react";
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
  const data = ocrEditMockData;
  const [selectedId, setSelectedId] = useState<string>(data.images[0].id);
  const selected: OcrImageItem | undefined = data.images.find((image) => image.id === selectedId);

  return (
    <AppShell activeNav="upload" crumb="입력 · OCR" title="OCR 결과 확인 및 수정">
      <Body>
        <ImageList
          images={data.images}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={() => undefined}
        />
        <ImagePreview image={selected} />
        <EditForm image={selected} />
      </Body>
      <Footer>
        <Button variant="ghost" size="lg">
          다시 OCR 분석
        </Button>
        <Button variant="primary" size="lg">
          저장
        </Button>
      </Footer>
    </AppShell>
  );
};
