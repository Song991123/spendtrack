/**
 * 역할: 해당 화면의 상태와 레이아웃을 조립하는 페이지 진입 파일입니다.
 *       OCR 초안을 보여주고 주문별로 주문일자/상태 태그를 수정할 수 있게 하며,
 *       저장 시에는 주문 하나당 TxRow 하나를 만들어 매칭 후보가 있는 건만
 *       모달을 띄우고, 나머지는 자동으로 저장해 여러 건을 한 번에 처리합니다.
 * 위치: src\pages\OcrEdit\index.tsx
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { Button } from "../../components/primitives/Button";
import { MatchTransactionModal } from "../../components/modal/MatchTransactionModal";
import { media } from "../../tokens/breakpoints";
import { ImageList } from "./components/ImageList";
import { ImagePreview } from "./components/ImagePreview";
import { EditForm } from "./components/EditForm";
import {
  ocrEditMockData,
  type OcrImageItem,
  type OcrOrder,
} from "./data";
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

/**
 * 주문(OcrOrder) 하나를 TxRow 하나로 변환합니다.
 *
 * - 환불(refund)은 수입(+)으로, 구매/취소/정기결제는 지출(-)로 부호를 통일합니다.
 *   가계부 집계에서 지출/수입 부호가 섞이면 합계가 엉키므로 저장 시점에
 *   명시적으로 분기해 두는 편이 안전합니다.
 * - 카테고리는 OCR만으로 단정할 수 없어 ["etc"]로 시작합니다. EditForm의
 *   카테고리 체크박스가 상위로 승격되면 여기서 선택값을 주입하게 됩니다.
 * - id에는 주문 id 일부를 섞어 같은 캡쳐에서 나온 여러 TxRow가 식별 가능하도록 합니다.
 */
function buildCandidateFromOrder(image: OcrImageItem, order: OcrOrder): TxRow {
  const categories: TxCategory[] = ["etc"];
  const title = order.products[0]?.name ?? "OCR 거래";
  const isIncome = order.statusTag === "refund";
  const signedAmount = isIncome
    ? Math.abs(order.totalAmount)
    : -Math.abs(order.totalAmount);

  return {
    id: `ocr-${image.id}-${order.id}-${Date.now()}`,
    type: isIncome ? "income" : "expense",
    date: order.orderDate,
    platform: image.platform,
    categories,
    title,
    amount: signedAmount,
    status: order.statusTag,
    source: "ocr",
    detail: {
      items: order.products.map((product) => ({
        name: product.name,
        price: product.price,
      })),
      source: "OCR",
    },
  };
}

/** 한 이미지에서 주문별 TxRow 후보 배열을 만듭니다. */
function buildCandidatesFromImage(image: OcrImageItem): TxRow[] {
  return image.orders.map((order) => buildCandidateFromOrder(image, order));
}

/**
 * 매칭 후보가 있어 사용자 확인이 필요한 큐 엔트리.
 * 모달이 한 번에 한 건씩 처리하므로 대기열 형태로 저장하고, 처리한 만큼
 * shift하면서 남은 건을 이어서 보여 줍니다.
 */
interface MatchQueueEntry {
  candidate: TxRow;
  matches: TxRow[];
  productCount: number;
}

export const OcrEditPage: React.FC = () => {
  const navigate = useNavigate();
  const allRows = useTransactionsStore();

  // 초기 시드는 mock 데이터지만 주문일자·상태 태그는 페이지 내부 상태로 두어
  // 사용자가 바로 고칠 수 있습니다. 주문 레벨로 보관해야 같은 캡쳐 안의 여러 주문을
  // 독립적으로 수정할 수 있습니다.
  const [images, setImages] = useState<OcrImageItem[]>(ocrEditMockData.images);
  const [selectedId, setSelectedId] = useState<string>(images[0].id);
  const selected = images.find((image) => image.id === selectedId);

  // 매칭 후보가 있는 주문을 순차적으로 처리하기 위한 큐. 0번 인덱스가 현재 모달에 뜨는 건.
  const [matchQueue, setMatchQueue] = useState<MatchQueueEntry[]>([]);

  /**
   * 주문 필드(주문일자·상태 태그) 변경을 이미지 상태에 반영합니다.
   * orderId 단위로 patch를 받으므로 한 캡쳐에 주문이 늘어나도 핸들러는 그대로 재사용됩니다.
   */
  const handleOrderPatch = (
    orderId: string,
    patch: Partial<Pick<OcrOrder, "orderDate" | "statusTag">>
  ) => {
    setImages((prev) =>
      prev.map((image) => {
        if (image.id !== selectedId) return image;
        return {
          ...image,
          orders: image.orders.map((order) =>
            order.id === orderId ? { ...order, ...patch } : order
          ),
        };
      })
    );
  };

  const handleSave = () => {
    if (!selected) return;

    const candidates = buildCandidatesFromImage(selected);

    // 주문별로 매칭을 돌려 "이미 저장된 거래와 겹치는 것"과 "새로 저장해도 되는 것"을 분리합니다.
    const entries = candidates.map((candidate, index) => {
      const order = selected.orders[index];
      const matches = findMatches(allRows, {
        platform: selected.platform,
        amount: Math.abs(candidate.amount),
        date: candidate.date,
      });
      return {
        candidate,
        matches,
        productCount: order.products.length,
      };
    });

    const needsModal = entries.filter((entry) => entry.matches.length > 0);
    const canAutoSave = entries.filter((entry) => entry.matches.length === 0);

    if (canAutoSave.length > 0) {
      // 매칭 후보가 없는 주문은 모달 없이 바로 묶어서 저장합니다.
      transactionsStore.addMany(canAutoSave.map((entry) => entry.candidate));
    }

    if (needsModal.length === 0) {
      navigate("/transactions");
      return;
    }

    setMatchQueue(needsModal);
  };

  /**
   * 큐에서 한 건을 처리한 뒤 다음 상태를 계산합니다. rest가 비어 있으면 전체 흐름이
   * 끝난 것이므로 거래내역 페이지로 이동까지 같이 해 줍니다. setState를 effect
   * 안에서 호출하는 패턴을 피하기 위해 이 작은 헬퍼에 전이 로직을 모아 둡니다.
   */
  const advanceQueue = (rest: MatchQueueEntry[]) => {
    setMatchQueue(rest);
    if (rest.length === 0) {
      navigate("/transactions");
    }
  };

  /** 현재 모달 건을 기존 거래에 붙이고 다음 큐 항목으로 넘어갑니다. */
  const handleAttach = (transactionId: string) => {
    const [current, ...rest] = matchQueue;
    if (!current) return;
    transactionsStore.appendItemsToTransaction(
      transactionId,
      current.candidate.detail?.items ?? [],
      "OCR"
    );
    advanceQueue(rest);
  };

  /** 현재 모달 건을 새 거래로 저장하고 다음 큐 항목으로 넘어갑니다. */
  const handleSaveAsNew = () => {
    const [current, ...rest] = matchQueue;
    if (!current) return;
    transactionsStore.addOne(current.candidate);
    advanceQueue(rest);
  };

  /**
   * 사용자가 모달 X를 눌러 흐름을 중단. 현재 주문만 저장하지 않고 큐 전체를 비우며,
   * 이미 addMany로 저장된 "매칭 없는 주문들"은 그대로 유지됩니다. 페이지에 머물러
   * 필요한 편집 후 재저장할 수 있게 navigate를 일부러 하지 않습니다.
   */
  const handleCloseModal = () => {
    setMatchQueue([]);
  };

  const currentMatch = matchQueue[0];

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
        <EditForm image={selected} onOrderPatch={handleOrderPatch} />
      </Body>
      <Footer>
        <Button variant="ghost" size="lg" onClick={() => navigate("/ocr-upload")}>
          다시 OCR 분석
        </Button>
        <Button variant="primary" size="lg" onClick={handleSave}>
          저장
        </Button>
      </Footer>
      {currentMatch && (
        <MatchTransactionModal
          isOpen
          onClose={handleCloseModal}
          candidate={{
            platform: currentMatch.candidate.platform,
            date: currentMatch.candidate.date,
            amount: Math.abs(currentMatch.candidate.amount),
            itemCount: currentMatch.productCount,
          }}
          matches={currentMatch.matches}
          onAttachToExisting={handleAttach}
          onSaveAsNew={handleSaveAsNew}
        />
      )}
    </AppShell>
  );
};
