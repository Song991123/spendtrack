/**
 * 역할: 해당 화면의 상태와 레이아웃을 조립하는 페이지 진입 파일입니다.
 * 위치: src\pages\ManualEntry\index.tsx
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { Card, CardBd } from "../../components/primitives/Card";
import { Button } from "../../components/primitives/Button";
import {
  ProductAddModal,
  type ProductAddPayload,
} from "../../components/modal/ProductAddModal";
import { tokens } from "../../styles/tokens";
import { TypeSegment, type TxType } from "./components/TypeSegment";
import { MetaFields, type MetaFieldValues } from "./components/MetaFields";
import { StatusTags, type StatusKey } from "./components/StatusTags";
import {
  defaultStatusForType,
  isValidStatusForType,
} from "./components/statusOptions";
import { ProductRows, type ManualProduct } from "./components/ProductRows";
import { transactionsStore } from "../../stores/transactionsStore";
import type { TxRow } from "./../Transactions/components/TransactionTable";
import { todayAsDotDate } from "../../utils/date";
import { mapCategories, mapPlatform } from "../../utils/manualMapping";

const Lead = styled.p`
  margin: 0 0 16px;
  color: ${tokens.color.ink3};
  font-size: 13px;
`;

const SectionLabel = styled.div`
  margin-bottom: 8px;
  color: ${tokens.color.ink2};
  font-size: 12px;
  font-weight: 600;
`;

const SectionHint = styled.div`
  margin-bottom: 10px;
  color: ${tokens.color.ink4};
  font-size: 11.5px;
`;

const Foot = styled.div`
  margin-top: 16px;
  color: ${tokens.color.ink4};
  font-size: 11.5px;
`;

const SaveBar = styled.div`
  margin-top: 16px;
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

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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

/**
 * 모달은 '추가'와 '수정' 두 모드로 동작합니다. editingId가 설정되면 수정 모드,
 * null이면 추가 모드입니다. 이렇게 한 모달로 두 흐름을 공유해 UI 일관성을 유지합니다.
 */
type ModalMode = { type: "add" } | { type: "edit"; id: string };

const EMPTY_META: MetaFieldValues = {
  title: "",
  amount: "",
  platform: "",
  date: "",
  // 사용자가 카테고리를 명시적으로 선택하기 전까지는 "기타"가 디폴트로 체크돼 있습니다.
  // 사용자가 다른 카테고리를 고르면 그대로 덮어 써집니다.
  categories: ["etc"],
  memo: "",
};

export const ManualEntryPage: React.FC = () => {
  // 수동 입력 화면은 거래 유형, 상태, 메타 필드, 상품 목록을 한 페이지에서 조정합니다.
  const navigate = useNavigate();
  const [type, setType] = useState<TxType>("expense");
  const [status, setStatus] = useState<StatusKey | null>("purchase");
  const [meta, setMeta] = useState<MetaFieldValues>(EMPTY_META);
  const [products, setProducts] = useState<ManualProduct[]>([]);
  const [modal, setModal] = useState<ModalMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editingProduct =
    modal?.type === "edit"
      ? products.find((product) => product.id === modal.id) ?? null
      : null;

  const handleSubmit = (payload: ProductAddPayload) => {
    if (modal?.type === "edit") {
      // 수정 저장 시 해당 id의 상품 항목만 새 값으로 교체합니다.
      setProducts((current) =>
        current.map((product) =>
          product.id === modal.id ? { ...product, ...payload } : product
        )
      );
    } else {
      // 데모 단계에서는 간단히 현재 시간값을 id로 써서 새 상품 행을 구분합니다.
      setProducts((current) => [
        ...current,
        { ...payload, id: String(Date.now()) },
      ]);
    }
    setModal(null);
  };

  /**
   * '거래 저장하기'를 누르면 필수 값만 검사한 뒤 transactionsStore.addOne에 담아
   * /transactions 로 이동합니다. 상품 목록이 있으면 detail.items로 함께 넣어서
   * DetailPanel에서 즉시 보이도록 합니다. 모든 상태는 localStorage에 영속됩니다.
   */
  const handleSave = () => {
    // 최소한 거래명 + 금액은 있어야 집계가 가능합니다. 없으면 인라인 에러만 표시.
    const amountNumber = Number(meta.amount.replace(/[^0-9]/g, ""));
    if (!meta.title.trim()) {
      setError("거래명을 입력해 주세요.");
      return;
    }
    if (!amountNumber || Number.isNaN(amountNumber)) {
      setError("금액을 숫자로 입력해 주세요.");
      return;
    }
    const signedAmount = type === "expense" ? -Math.abs(amountNumber) : Math.abs(amountNumber);
    const fallbackDate = todayAsDotDate();
    const row: TxRow = {
      id: `m_${Date.now()}`,
      type,
      title: meta.title.trim(),
      amount: signedAmount,
      date: meta.date.trim() || fallbackDate,
      platform: mapPlatform(meta.platform),
      categories: mapCategories(meta.categories),
      // 상태를 고르지 않았거나 타입과 안 맞는 상태가 남아있으면 타입별 안전 디폴트로 수렴시킵니다.
      status:
        status && isValidStatusForType(status, type)
          ? status
          : defaultStatusForType(type),
      source: "manual",
      memo: meta.memo.trim() || undefined,
      detail:
        products.length > 0
          ? {
              items: products.map((product) => ({
                name: product.name,
                price: product.price,
                link: product.link,
              })),
              source: "MANUAL",
            }
          : undefined,
    };
    transactionsStore.addOne(row);
    navigate("/transactions");
  };

  return (
    <AppShell activeNav="upload" crumb="입력 · 수동" title="수동 입력">
      <Card>
        <CardBd>
          <Lead>지출 또는 수입 내역을 직접 기록해 보세요.</Lead>

          <SectionLabel>거래 유형</SectionLabel>
          <div style={{ marginBottom: 16 }}>
            <TypeSegment
              value={type}
              onChange={(nextType) => {
                setType(nextType);
                // 유형이 바뀌면 반대편 전용 상태(예: 지출의 "구매", 수입의 "취소")가
                // 남아있지 않도록, 새 유형에서 유효하지 않으면 안전 디폴트로 자동 전환합니다.
                setStatus((currentStatus) =>
                  currentStatus && isValidStatusForType(currentStatus, nextType)
                    ? currentStatus
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
          <div style={{ marginBottom: 20 }}>
            <StatusTags value={status} type={type} onChange={setStatus} />
          </div>

          <SectionHeader>
            <SectionLabel style={{ margin: 0 }}>등록된 상품</SectionLabel>
            <AddButton type="button" onClick={() => setModal({ type: "add" })}>
              + 상품 추가
            </AddButton>
          </SectionHeader>
          {/* 거래 하나 안에 여러 상품이 들어갈 수 있다는 점을 여기서 보여줍니다. */}
          <SectionHint>
            상품을 추가하면 거래에 포함된 구매 항목을 함께 기록할 수 있어요.
            수정이 필요하면 행의 '수정'을 눌러보세요.
          </SectionHint>
          <ProductRows
            products={products}
            onEdit={(id) => setModal({ type: "edit", id })}
            onRemove={(id) =>
              setProducts((current) =>
                current.filter((product) => product.id !== id)
              )
            }
          />

          {error && <ErrorLine role="alert">{error}</ErrorLine>}

          <SaveBar data-tour="manual-savebar">
            <Button variant="primary" size="lg" block onClick={handleSave}>
              거래 저장하기
            </Button>
          </SaveBar>

          <Foot>상품 추가 후 상품명, 금액, 링크를 한 번에 입력할 수 있어요.</Foot>
        </CardBd>
      </Card>

      <ProductAddModal
        isOpen={modal !== null}
        initialValues={editingProduct}
        onClose={() => setModal(null)}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
};
