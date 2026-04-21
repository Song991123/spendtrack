/**
 * 역할: 해당 화면의 상태와 레이아웃을 조립하는 페이지 진입 파일입니다.
 *       OCR 초안을 보여주고 주문일자를 수정할 수 있게 하며,
 *       저장 시 기존 거래와 매칭 후보가 있으면 모달을 띄워 사용자가 병합 여부를 선택합니다.
 * 위치: src\pages\OcrEdit\index.tsx
 */
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { Button } from "../../components/primitives/Button";
import { MatchTransactionModal } from "../../components/modal/MatchTransactionModal";
import { media } from "../../tokens/breakpoints";
import { ImageList } from "./components/ImageList";
import { ImagePreview } from "./components/ImagePreview";
import { EditForm } from "./components/EditForm";
import { ocrEditMockData, type OcrImageItem } from "./data";
import {
  transactionsStore,
  useTransactionsStore,
} from "../../stores/transactionsStore";
import { findMatches } from "../../utils/matchTransaction";
import type {
  TxCategory,
  TxRow,
} from "../Transactions/components/TransactionTable";

const Body = styled.div`
  display: grid;
  /* 이 화면의 주 목적은 데이터 확인/수정이므로 오른쪽 편집 폼에 가장 큰 지분을 줍니다.
   * 중앙 미리보기는 보조 역할이라 더 좁게 잡고, 왼쪽 목록은 썸네일 + 텍스트가
   * 잘리지 않을 만큼만 고정 폭을 확보합니다. */
  grid-template-columns: 240px minmax(280px, 0.9fr) minmax(440px, 1.6fr);
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

function buildCandidate(image: OcrImageItem): TxRow {
  const category: TxCategory = "living";
  const title = image.products[0]?.name ?? "OCR 거래";
  return {
    id: `ocr-${Date.now()}`,
    type: "expense",
    date: image.orderDate,
    platform: image.platform,
    category,
    title,
    amount: -Math.abs(image.totalAmount),
    status: image.statusTag,
    source: "ocr",
    detail: {
      items: image.products.map((product) => ({
        name: product.name,
        price: product.price,
      })),
      source: "OCR",
    },
  };
}

export const OcrEditPage: React.FC = () => {
  const navigate = useNavigate();
  const allRows = useTransactionsStore();

  // 초기 시드는 mock 데이터지만 주문일자는 페이지 내부 상태로 두어 사용자가 바로 고칠 수 있습니다.
  const [images, setImages] = useState<OcrImageItem[]>(ocrEditMockData.images);
  const [selectedId, setSelectedId] = useState<string>(images[0].id);
  const selected = images.find((image) => image.id === selectedId);

  const [matchState, setMatchState] = useState<null | {
    candidate: TxRow;
    matches: TxRow[];
    productCount: number;
  }>(null);

  const handleOrderDateChange = (value: string) => {
    setImages((prev) =>
      prev.map((image) =>
        image.id === selectedId ? { ...image, orderDate: value } : image
      )
    );
  };

  const candidateMatches = useMemo(() => {
    if (!selected) return [];
    return findMatches(allRows, {
      platform: selected.platform,
      amount: selected.totalAmount,
      date: selected.orderDate,
    });
  }, [allRows, selected]);

  const handleSave = () => {
    if (!selected) return;
    const candidate = buildCandidate(selected);

    if (candidateMatches.length > 0) {
      setMatchState({
        candidate,
        matches: candidateMatches,
        productCount: selected.products.length,
      });
      return;
    }

    transactionsStore.addOne(candidate);
    navigate("/transactions");
  };

  const handleAttach = (transactionId: string) => {
    if (!selected) return;
    transactionsStore.appendItemsToTransaction(
      transactionId,
      selected.products.map((product) => ({
        name: product.name,
        price: product.price,
      })),
      "OCR"
    );
    setMatchState(null);
    navigate("/transactions");
  };

  const handleSaveAsNew = () => {
    if (!matchState) return;
    transactionsStore.addOne(matchState.candidate);
    setMatchState(null);
    navigate("/transactions");
  };

  return (
    <AppShell activeNav="upload" crumb="입력 · OCR" title="OCR 결과 확인 및 수정">
      <Body>
        {/* OCR 편집 화면은 목록, 미리보기, 수정 폼의 3단 구성을 사용합니다. */}
        <ImageList
          images={images}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={() => navigate("/ocr-upload")}
        />
        <ImagePreview image={selected} />
        <EditForm image={selected} onOrderDateChange={handleOrderDateChange} />
      </Body>
      <Footer>
        <Button variant="ghost" size="lg" onClick={() => navigate("/ocr-upload")}>
          다시 OCR 분석
        </Button>
        <Button variant="primary" size="lg" onClick={handleSave}>
          저장
        </Button>
      </Footer>
      {matchState && (
        <MatchTransactionModal
          isOpen
          onClose={() => setMatchState(null)}
          candidate={{
            platform: matchState.candidate.platform,
            date: matchState.candidate.date,
            amount: Math.abs(matchState.candidate.amount),
            itemCount: matchState.productCount,
          }}
          matches={matchState.matches}
          onAttachToExisting={handleAttach}
          onSaveAsNew={handleSaveAsNew}
        />
      )}
    </AppShell>
  );
};
