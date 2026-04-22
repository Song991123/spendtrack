/**
 * 역할: 거래 상세 패널에서 '수정하기'를 눌렀을 때 열리는 편집용 모달.
 *       TxRow의 값을 폼에 미리 채워 넣고, 저장 시 transactionsStore.updateOne을 호출해
 *       실제 데이터가 갱신되도록 합니다. 수동 입력 화면의 하위 컴포넌트를 그대로 재사용해
 *       디자인과 동작 일관성을 유지합니다.
 *
 *       상태는 row prop을 기반으로 useState 초기자에서 한 번만 읽어들이고, 새로운 거래를
 *       편집할 때는 상위에서 key를 바꿔 컴포넌트를 remount 시켜 초기화합니다.
 *       이 방식은 useEffect에서 setState로 동기화할 때 생기는 cascading render를 피합니다.
 * 위치: src\components\modal\TransactionEditModal.tsx
 */
import React, { useState } from "react";
import styled from "styled-components";
import { Modal } from "./Modal";
import { Button } from "../primitives/Button";
import {
  ProductAddModal,
  type ProductAddPayload,
} from "./ProductAddModal";
import { TypeSegment, type TxType } from "../../pages/ManualEntry/components/TypeSegment";
import {
  MetaFields,
  type MetaFieldValues,
} from "../../pages/ManualEntry/components/MetaFields";
import {
  StatusTags,
  type StatusKey,
} from "../../pages/ManualEntry/components/StatusTags";
import {
  defaultStatusForType,
  isValidStatusForType,
} from "../../pages/ManualEntry/components/statusOptions";
import {
  ProductRows,
  type ManualProduct,
} from "../../pages/ManualEntry/components/ProductRows";
import type { TxRow } from "../../pages/Transactions/components/TransactionTable";
import { PLATFORM_LABELS } from "../../constants/labels";
import { mapCategories, mapPlatform } from "../../utils/manualMapping";
import { tokens } from "../../styles/tokens";

interface Props {
  /** 편집 대상 거래. 상위에서 반드시 존재할 때만 이 컴포넌트를 마운트합니다. */
  row: TxRow;
  onClose: () => void;
  onSubmit: (id: string, patch: Partial<TxRow>) => void;
}

/**
 * 모달 내부가 뷰포트보다 길어질 수 있으니, 카드 높이는 유지한 채 본문만 내부에서 스크롤되게 합니다.
 * Modal은 고정 480px 너비이지만 편집 폼은 필드가 많아 세로 스크롤이 필수입니다.
 */
const ScrollBody = styled.div`
  max-height: min(70vh, 640px);
  overflow-y: auto;
  /*
   * 스크롤바와 입력 필드가 딱 붙지 않도록 우측에 12px 여백을 둡니다. 같은 크기의 음수
   * 마진으로 상쇄해서 ScrollBody 자체 너비는 그대로 유지 — 모달 레이아웃이 밀려 나오지
   * 않으면서 오른쪽으로만 약간 튀어나와 스크롤바가 숨을 쉬는 영역을 확보합니다.
   * scrollbar-gutter 로 대체할 수도 있지만, 지원 브라우저 편차가 있어 padding 트릭을
   * 유지해 구형 Safari 에서도 동일하게 보이게 합니다.
   */
  padding-right: 12px;
  margin-right: -12px;
`;

const SectionLabel = styled.div`
  margin-bottom: 8px;
  color: ${tokens.color.ink2};
  font-size: 12px;
  font-weight: 600;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
  margin-bottom: 8px;
`;

const SectionHint = styled.div`
  margin-bottom: 10px;
  color: ${tokens.color.ink4};
  font-size: 11.5px;
`;

const AddButton = styled.button`
  border: none;
  background: none;
  color: ${tokens.color.accentHover};
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
`;

const ErrorLine = styled.div`
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px solid ${tokens.color.neg};
  border-radius: ${tokens.radius.control};
  background: ${tokens.color.negBg};
  color: ${tokens.color.neg};
  font-size: 12px;
  font-weight: 500;
`;

const SaveBar = styled.div`
  margin-top: 16px;
`;

/**
 * 상품(items)에는 원래 ID가 없어서 편집 UI에서 개별 행을 식별하기 위한 임시 ID를 붙여 둡니다.
 * 저장 시 ID는 떨어뜨리고 다시 { name, price, link } 형태로 직렬화해서 돌려줍니다.
 */
type ProductModalMode = { type: "add" } | { type: "edit"; id: string };

function rowToMeta(row: TxRow): MetaFieldValues {
  return {
    title: row.title,
    // TxRow.amount는 부호 있는 숫자(지출은 음수). UI에서는 양수값으로 보여주고,
    // 저장 시 type에 따라 다시 부호를 붙입니다.
    amount: String(Math.abs(row.amount)),
    // TxPlatform enum → 사람이 읽는 라벨. mapPlatform이 다시 enum으로 수렴해 주므로 양방향 안전.
    platform: PLATFORM_LABELS[row.platform],
    date: row.date,
    categories: [...row.categories],
    memo: row.memo ?? "",
  };
}

function rowToProducts(row: TxRow): ManualProduct[] {
  return (
    row.detail?.items.map((item, index) => ({
      id: `${row.id}-item-${index}`,
      name: item.name,
      price: item.price,
      link: item.link,
    })) ?? []
  );
}

export const TransactionEditModal: React.FC<Props> = ({ row, onClose, onSubmit }) => {
  // row는 마운트 시점의 prop으로만 초기화됩니다. 새로운 거래를 편집하려면 상위에서 key를 바꿔
  // 이 컴포넌트를 다시 마운트하도록 합니다. 이렇게 하면 사용자가 편집 중 값이 엉뚱하게 튀는
  // 동기화 문제도 사라지고, useEffect + setState 안티패턴도 없어집니다.
  const [type, setType] = useState<TxType>(row.type);
  const [status, setStatus] = useState<StatusKey | null>(row.status);
  const [meta, setMeta] = useState<MetaFieldValues>(() => rowToMeta(row));
  const [products, setProducts] = useState<ManualProduct[]>(() => rowToProducts(row));
  const [productModal, setProductModal] = useState<ProductModalMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editingProduct =
    productModal?.type === "edit"
      ? products.find((product) => product.id === productModal.id) ?? null
      : null;

  const handleProductSubmit = (payload: ProductAddPayload) => {
    if (productModal?.type === "edit") {
      setProducts((current) =>
        current.map((product) =>
          product.id === productModal.id ? { ...product, ...payload } : product
        )
      );
    } else {
      setProducts((current) => [
        ...current,
        { ...payload, id: `new_${Date.now()}` },
      ]);
    }
    setProductModal(null);
  };

  const handleSave = () => {
    // 수동 입력과 같은 규칙: 거래명과 금액은 최소한 필요.
    const amountNumber = Number(meta.amount.replace(/[^0-9]/g, ""));
    if (!meta.title.trim()) {
      setError("거래명을 입력해 주세요.");
      return;
    }
    if (!amountNumber || Number.isNaN(amountNumber)) {
      setError("금액을 숫자로 입력해 주세요.");
      return;
    }

    const signedAmount =
      type === "expense" ? -Math.abs(amountNumber) : Math.abs(amountNumber);

    const patch: Partial<TxRow> = {
      type,
      title: meta.title.trim(),
      amount: signedAmount,
      date: meta.date.trim() || row.date,
      platform: mapPlatform(meta.platform),
      categories: mapCategories(meta.categories),
      status:
        status && isValidStatusForType(status, type)
          ? status
          : defaultStatusForType(type),
      memo: meta.memo.trim() || undefined,
      // 상품이 하나라도 있으면 detail을 재구성하고, 없으면 detail을 비워 두어
      // 이전에 붙어있던 items가 유령처럼 남지 않게 합니다.
      detail:
        products.length > 0
          ? {
              items: products.map((product) => ({
                name: product.name,
                price: product.price,
                link: product.link,
              })),
              // 기존 입력 경로(MANUAL/OCR) 표기는 유지하고, 비어 있으면 수동 편집으로 표기.
              source: row.detail?.source ?? "MANUAL",
            }
          : undefined,
    };

    onSubmit(row.id, patch);
    onClose();
  };

  return (
    <>
      <Modal isOpen onClose={onClose} title="거래 수정">
        <ScrollBody>
          <SectionLabel>거래 유형</SectionLabel>
          <div style={{ marginBottom: 16 }}>
            <TypeSegment
              value={type}
              onChange={(nextType) => {
                setType(nextType);
                // 지출 ↔ 수입 전환 시 유효하지 않게 된 상태는 자동으로 안전 디폴트로 돌립니다.
                setStatus((current) =>
                  current && isValidStatusForType(current, nextType)
                    ? current
                    : defaultStatusForType(nextType)
                );
              }}
            />
          </div>

          <MetaFields
            value={meta}
            onChange={(next) => {
              setMeta(next);
              if (error) setError(null);
            }}
          />

          <SectionLabel>상태 태그</SectionLabel>
          <div style={{ marginBottom: 16 }}>
            <StatusTags value={status} type={type} onChange={setStatus} />
          </div>

          <SectionHeader>
            <SectionLabel style={{ margin: 0 }}>등록된 상품</SectionLabel>
            <AddButton type="button" onClick={() => setProductModal({ type: "add" })}>
              + 상품 추가
            </AddButton>
          </SectionHeader>
          <SectionHint>
            상품을 추가하거나 각 행의 '수정'을 눌러 개별 상품을 고칠 수 있어요.
          </SectionHint>
          <ProductRows
            products={products}
            onEdit={(id) => setProductModal({ type: "edit", id })}
            onRemove={(id) =>
              setProducts((current) => current.filter((p) => p.id !== id))
            }
          />

          {error && <ErrorLine role="alert">{error}</ErrorLine>}

          <SaveBar>
            <Button variant="primary" size="lg" block onClick={handleSave}>
              수정 저장하기
            </Button>
          </SaveBar>
        </ScrollBody>
      </Modal>

      {/* 편집 중에도 '상품 추가/수정'을 쓸 수 있어야 해서 Modal을 중첩합니다. 두 모달 모두
          같은 z-index를 쓰지만 후에 렌더되는 쪽이 DOM 순서상 위에 얹혀지므로 겹침이 자연스럽습니다. */}
      <ProductAddModal
        isOpen={productModal !== null}
        initialValues={editingProduct}
        onClose={() => setProductModal(null)}
        onSubmit={handleProductSubmit}
      />
    </>
  );
};
