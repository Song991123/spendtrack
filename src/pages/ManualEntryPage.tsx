import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../components/layout/AppShell";
import { FormField } from "../components/form/FormField";
import { TextInput } from "../components/form/TextInput";
import { ProductAddModal } from "../components/modal/ProductAddModal";
import { Button } from "../components/primitives/Button";
import { Card } from "../components/primitives/Card";
import { media } from "../tokens/breakpoints";
import type { Product, TransactionType } from "../types/transaction";

const FormCard = styled(Card)`
  padding: 32px;
`;

const SubTitle = styled.p`
  margin: 0 0 24px;
  font-size: 13px;
  color: #9ca3af;
`;

const FieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ToggleRow = styled.div`
  display: flex;
  gap: 8px;
`;

const TogglePill = styled.button<{ $active?: boolean }>`
  height: 32px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  border: none;
  font-family: inherit;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  background: ${({ $active }) => ($active ? "#4F6EF7" : "#F3F4F6")};
  color: ${({ $active }) => ($active ? "#FFFFFF" : "#6B7280")};
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TagPill = styled.button<{ $active?: boolean }>`
  height: 26px;
  padding: 0 16px;
  border-radius: 13px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  background: ${({ $active }) => ($active ? "#4F6EF7" : "#FFFFFF")};
  color: ${({ $active }) => ($active ? "#FFFFFF" : "#374151")};
  border: ${({ $active }) => ($active ? "none" : "1px solid #D1D5DB")};
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 24px 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
`;

const AddButton = styled.button`
  font-size: 12px;
  color: #4f6ef7;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  font-family: inherit;
`;

const ProductNote = styled.p`
  margin: 0 0 12px;
  font-size: 11px;
  color: #9ca3af;
`;

const ProductRow = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 0 16px;
  margin-bottom: 8px;
  gap: 12px;
`;

const ProductName = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProductPrice = styled.span`
  font-weight: 600;
  font-size: 13px;
  color: #111827;
  margin-right: 20px;
  flex-shrink: 0;
`;

const LinkAction = styled.button`
  font-size: 11px;
  color: #4f6ef7;
  cursor: pointer;
  margin-right: 16px;
  border: none;
  background: none;
  padding: 0;
  font-family: inherit;
  flex-shrink: 0;
`;

const DeleteAction = styled.button`
  font-size: 14px;
  color: #999999;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  font-family: inherit;
  flex-shrink: 0;
`;

const BottomHint = styled.p`
  margin: 16px 0 0;
  font-size: 11px;
  color: #9ca3af;
`;

const STATUS_TAGS = ["구매", "정기결제", "구독", "환불", "취소"] as const;

const createProductId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const ManualEntryPage = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [platform, setPlatform] = useState("");
  const [date, setDate] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>("구매");
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSave = () => {
    console.log({
      type,
      title,
      amount,
      platform,
      date,
      memo,
      selectedTag,
      products,
    });
    navigate("/transactions");
  };

  return (
    <AppShell
      activeNav="upload"
      title="수동 입력"
      headerRight="2025년 4월 19일 토요일"
    >
      <FormCard padding={32}>
        <SubTitle>지출 또는 수입 내역을 직접 기록하세요</SubTitle>

        <FieldStack>
          <FormField label="거래 유형">
            <ToggleRow>
              <TogglePill
                type="button"
                $active={type === "expense"}
                onClick={() => setType("expense")}
              >
                지출
              </TogglePill>
              <TogglePill
                type="button"
                $active={type === "income"}
                onClick={() => setType("income")}
              >
                수입
              </TogglePill>
            </ToggleRow>
          </FormField>

          <TwoCol>
            <FormField label="거래명">
              <TextInput
                placeholder="예: 쿠팡 주문, 네이버 환불"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormField>
            <FormField label="금액">
              <TextInput
                placeholder="₩ 0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormField>
          </TwoCol>

          <TwoCol>
            <FormField label="플랫폼">
              <TextInput
                placeholder="쿠팡, 네이버쇼핑, 무신사..."
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              />
            </FormField>
            <FormField label="거래일자">
              <TextInput
                placeholder="YYYY.MM.DD"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormField>
          </TwoCol>

          <FormField label="메모 (선택)">
            <TextInput
              placeholder="거래에 대한 메모를 남겨보세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </FormField>

          <FormField label="상태 태그 (선택)">
            <TagRow>
              {STATUS_TAGS.map((tag) => (
                <TagPill
                  key={tag}
                  type="button"
                  $active={selectedTag === tag}
                  onClick={() =>
                    setSelectedTag((prev) => (prev === tag ? null : tag))
                  }
                >
                  {tag}
                </TagPill>
              ))}
            </TagRow>
          </FormField>
        </FieldStack>

        <Divider />

        <SectionHeader>
          <SectionTitle>등록된 상품</SectionTitle>
          <AddButton type="button" onClick={() => setModalOpen(true)}>
            + 상품 추가
          </AddButton>
        </SectionHeader>

        <ProductNote>
          상품을 추가하면 거래에 포함된 구매 상품을 함께 기록할 수 있어요.
        </ProductNote>

        {products.map((product, index) => (
          <ProductRow key={product.id}>
            <ProductName>{product.name}</ProductName>
            <ProductPrice>₩{product.price.toLocaleString("ko-KR")}</ProductPrice>
            <LinkAction type="button" onClick={() => setModalOpen(true)}>
              링크
            </LinkAction>
            <DeleteAction type="button" onClick={() => removeProduct(index)}>
              ✕
            </DeleteAction>
          </ProductRow>
        ))}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          style={{ marginTop: 24 }}
          onClick={handleSave}
        >
          거래 저장하기
        </Button>

        <BottomHint>
          + 상품 추가를 누르면 상품명, 금액, 링크를 입력할 수 있어요.
        </BottomHint>
      </FormCard>

      <ProductAddModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(product) => {
          setProducts((prev) => [...prev, { ...product, id: createProductId() }]);
        }}
      />
    </AppShell>
  );
};
