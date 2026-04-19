import React from "react";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { tokens } from "../../styles/tokens";
import { media } from "../../tokens/breakpoints";
import { MethodCard } from "./components/MethodCard";
import { CameraIcon, PenIcon } from "./components/icons";

const Wrap = styled.div`
  display: grid;
  place-items: center;
  min-height: calc(100vh - 140px);
  padding: 40px 0;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 720px;
  text-align: center;
`;

const Prompt = styled.h2`
  margin: 0 0 32px;
  color: ${tokens.color.ink1};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const Options = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const UploadPage: React.FC = () => (
  <AppShell activeNav="upload" crumb="입력" title="내역 입력">
    <Wrap>
      <Inner>
        <Prompt>어떤 방법으로 내역을 입력하시겠어요?</Prompt>
        <Options>
          <MethodCard
            icon={<CameraIcon />}
            title="OCR로 입력"
            description={`쇼핑몰 주문내역 캡처를 인식해\n자동으로 입력합니다.`}
            ctaLabel="OCR 업로드 시작"
            ctaVariant="primary"
            footnote="취소·반품·환불·정기결제 자동 감지"
            href="/ocr-upload"
          />
          <MethodCard
            icon={<PenIcon />}
            title="수동 입력"
            description={`지출·수입 내역을 직접\n기록할 수 있습니다.`}
            ctaLabel="직접 입력 시작"
            ctaVariant="ghost"
            footnote="상품은 팝업으로 간편하게 추가"
            href="/manual-entry"
          />
        </Options>
      </Inner>
    </Wrap>
  </AppShell>
);
