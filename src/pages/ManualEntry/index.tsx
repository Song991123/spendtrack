import React, { useState } from "react";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { Card, CardBd } from "../../components/primitives/Card";
import { Button } from "../../components/primitives/Button";
import { tokens } from "../../styles/tokens";
import { TypeSegment, type TxType } from "./components/TypeSegment";
import { MetaFields } from "./components/MetaFields";
import { StatusTags, type StatusKey } from "./components/StatusTags";
import { ProductRows, type ManualProduct } from "./components/ProductRows";
import { AddProductModal } from "./components/AddProductModal";

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

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

export const ManualEntryPage: React.FC = () => {
  const [type, setType] = useState<TxType>("expense");
  const [status, setStatus] = useState<StatusKey | null>("purchase");
  const [products, setProducts] = useState<ManualProduct[]>([
    { id: "p1", name: "나이키 에어포스 1 로우", price: 129000 },
    { id: "p2", name: "나이키 에어맥스 90 블랙", price: 129000 },
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = (product: Omit<ManualProduct, "id">) => {
    setProducts((current) => [...current, { ...product, id: String(Date.now()) }]);
    setModalOpen(false);
  };

  return (
    <AppShell activeNav="upload" crumb="입력 · 수동" title="수동 입력">
      <Card>
        <CardBd>
          <Lead>지출 또는 수입 내역을 직접 기록하세요</Lead>

          <SectionLabel>거래 유형</SectionLabel>
          <div style={{ marginBottom: 16 }}>
            <TypeSegment value={type} onChange={setType} />
          </div>

          <MetaFields />

          <SectionLabel>상태 태그 (선택)</SectionLabel>
          <div style={{ marginBottom: 20 }}>
            <StatusTags value={status} onChange={setStatus} />
          </div>

          <SectionHeader>
            <SectionLabel style={{ margin: 0 }}>등록된 상품</SectionLabel>
            <AddButton type="button" onClick={() => setModalOpen(true)}>
              + 상품 추가
            </AddButton>
          </SectionHeader>
          <SectionHint>상품을 추가하면 거래에 포함된 구매 상품을 함께 기록할 수 있어요.</SectionHint>
          <ProductRows products={products} onRemove={(id) => setProducts((current) => current.filter((product) => product.id !== id))} />

          <SaveBar>
            <Button variant="primary" size="lg" block>
              거래 저장하기
            </Button>
          </SaveBar>

          <Foot>+ 상품 추가를 누르면 상품명, 금액, 링크를 입력할 수 있어요.</Foot>
        </CardBd>
      </Card>

      {modalOpen && <AddProductModal onClose={() => setModalOpen(false)} onSubmit={handleAdd} />}
    </AppShell>
  );
};
