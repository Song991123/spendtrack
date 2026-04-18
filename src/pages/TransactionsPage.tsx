import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { Tag } from "../components/primitives/Tag";
import { mockTransactions } from "../data/mockTransactions";
import { media } from "../tokens/breakpoints";
import type { StatusTag, Transaction } from "../types/transaction";
import {
  formatAmount,
  platformLabel,
  statusLabel,
  typeLabel,
} from "../utils/transaction";

const PERIOD_OPTIONS = [
  { value: "all", label: "전체 기간" },
  { value: "2025-04", label: "2025년 4월" },
  { value: "2025-03", label: "2025년 3월" },
];

const PLATFORM_OPTIONS = [
  { value: "all", label: "플랫폼 전체" },
  { value: "coupang", label: "쿠팡" },
  { value: "naver", label: "네이버쇼핑" },
  { value: "musinsa", label: "무신사" },
];

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;

  ${media.mobile} {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  width: 244px;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 13px;
  padding: 0 14px;
  color: #111827;
  background: #ffffff;
  font-family: inherit;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  ${media.mobile} {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 13px;
  color: #374151;
  background: #ffffff;
  cursor: pointer;
  min-width: 148px;
  font-family: inherit;

  ${media.mobile} {
    flex: 1;
    min-width: 0;
  }
`;

const ResultCount = styled.span`
  margin-left: auto;
  font-size: 13px;
  color: #9ca3af;

  ${media.mobile} {
    width: 100%;
    margin-left: 0;
    margin-top: 8px;
    text-align: left;
  }
`;

const ContentRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;

  ${media.tablet} {
    align-items: stretch;
  }

  ${media.mobile} {
    flex-direction: column;
  }
`;

const TableSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const TableCard = styled(Card)`
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 90px 100px 1fr 120px 70px;
  min-height: 44px;
  align-items: center;
  padding: 0 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  gap: 12px;

  ${media.mobile} {
    grid-template-columns: 1fr 100px;
  }
`;

const ColHead = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
`;

const HideOnMobile = styled.div`
  ${media.mobile} {
    display: none;
  }
`;

const TableRow = styled.button<{ $selected?: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: 60px 90px 100px 1fr 120px 70px;
  min-height: 52px;
  align-items: center;
  padding: 0 16px;
  border: none;
  border-bottom: 1px solid #f3f4f6;
  background: ${({ $selected }) => ($selected ? "#f5f7ff" : "#ffffff")};
  cursor: pointer;
  gap: 12px;
  text-align: left;
  font-family: inherit;

  ${media.mobile} {
    grid-template-columns: 1fr 100px;
  }
`;

const Cell = styled.div`
  min-width: 0;
  font-size: 13px;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TitleCell = styled(Cell)`
  font-weight: 500;
  color: #111827;
`;

const Amount = styled.span<{ $type: Transaction["type"]; $statusTag: StatusTag }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $type, $statusTag }) => {
    if ($statusTag === "cancel") return "#808080";
    return $type === "expense" ? "#D92626" : "#3E76FC";
  }};
`;

const PanelCard = styled(Card)`
  width: 476px;
  flex-shrink: 0;

  ${media.tablet} {
    width: 380px;
  }

  ${media.mobile} {
    width: 100%;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 24px;
  align-items: center;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const CloseBtn = styled.button`
  font-size: 16px;
  color: #9ca3af;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
`;

const PanelBody = styled.div`
  padding: 20px 24px;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const TxName = styled.h4`
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const DateAmountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const TxDate = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`;

const Sep = styled.span`
  color: #d1d5db;
`;

const TxAmount = styled.span<{ $type: Transaction["type"]; $statusTag: StatusTag }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ $type, $statusTag }) => {
    if ($statusTag === "cancel") return "#808080";
    return $type === "expense" ? "#D92626" : "#3E76FC";
  }};
`;

const SectionLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin: 16px 0 12px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  gap: 12px;

  span:first-child {
    font-size: 13px;
    color: #374151;
    flex: 1;
  }

  span:last-child {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    flex-shrink: 0;
  }
`;

const EmptyNote = styled.p`
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
`;

const DeleteBtn = styled.button`
  width: 100%;
  height: 44px;
  border: 1px solid #e54d4d;
  border-radius: 10px;
  color: #e54d4d;
  background: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  font-family: inherit;
`;

const LinkAction = styled.button`
  font-size: 12px;
  color: #4f6ef7;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  font-family: inherit;
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #6b7280;
  font-size: 13px;
`;

export const TransactionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    mockTransactions[0]?.id ?? null
  );

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((tx) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const titleMatch = tx.title.toLowerCase().includes(q);
        const productMatch =
          tx.products?.some((product) => product.name.toLowerCase().includes(q)) ??
          false;
        if (!titleMatch && !productMatch) return false;
      }

      if (selectedPeriod !== "all") {
        const txMonth = tx.date.slice(0, 7).replace(".", "-");
        if (txMonth !== selectedPeriod) return false;
      }

      if (selectedPlatform !== "all") {
        if (tx.platform !== selectedPlatform) return false;
      }

      return true;
    });
  }, [searchQuery, selectedPeriod, selectedPlatform]);

  useEffect(() => {
    if (
      selectedId &&
      !filteredTransactions.find((tx) => tx.id === selectedId)
    ) {
      setSelectedId(filteredTransactions[0]?.id ?? null);
    }
  }, [filteredTransactions, selectedId]);

  const selectedTx = useMemo(
    () =>
      filteredTransactions.find((transaction) => transaction.id === selectedId) ??
      null,
    [filteredTransactions, selectedId]
  );

  const expenseCount = filteredTransactions.filter(
    (transaction) => transaction.type === "expense"
  ).length;
  const incomeCount = filteredTransactions.filter(
    (transaction) => transaction.type === "income"
  ).length;

  return (
    <AppShell activeNav="transactions" title="수입/지출 내역">
      <PageLayout>
        <FilterRow>
          <SearchInput
            placeholder="🔍  주문명·상품명 검색"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <FilterSelect
            value={selectedPeriod}
            onChange={(event) => setSelectedPeriod(event.target.value)}
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            value={selectedPlatform}
            onChange={(event) => setSelectedPlatform(event.target.value)}
          >
            {PLATFORM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">카테고리</option>
          </FilterSelect>

          <ResultCount>
            총 {filteredTransactions.length}건 (지출 {expenseCount} · 수입{" "}
            {incomeCount})
          </ResultCount>
        </FilterRow>

        <ContentRow>
          <TableSection>
            <TableCard padding={0}>
              <TableHeader>
                <ColHead>
                  <HideOnMobile>유형</HideOnMobile>
                </ColHead>
                <ColHead>
                  <HideOnMobile>주문일</HideOnMobile>
                </ColHead>
                <ColHead>
                  <HideOnMobile>플랫폼</HideOnMobile>
                </ColHead>
                <ColHead>거래명</ColHead>
                <ColHead>금액</ColHead>
                <ColHead>
                  <HideOnMobile>상태</HideOnMobile>
                </ColHead>
              </TableHeader>

              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    type="button"
                    $selected={selectedId === transaction.id}
                    onClick={() => setSelectedId(transaction.id)}
                  >
                    <Cell as={HideOnMobile}>
                      <Tag variant="type" value={typeLabel(transaction.type)} />
                    </Cell>
                    <Cell as={HideOnMobile}>{transaction.date}</Cell>
                    <Cell as={HideOnMobile}>
                      <Tag
                        variant="platform"
                        value={platformLabel(transaction.platform)}
                      />
                    </Cell>
                    <TitleCell>{transaction.title}</TitleCell>
                    <Cell>
                      <Amount
                        $type={transaction.type}
                        $statusTag={transaction.statusTag}
                      >
                        {formatAmount(transaction.amount, transaction.type)}
                      </Amount>
                    </Cell>
                    <Cell as={HideOnMobile}>
                      <Tag
                        variant="status"
                        value={statusLabel(transaction.statusTag)}
                      />
                    </Cell>
                  </TableRow>
                ))
              ) : (
                <EmptyState>조건에 맞는 거래가 없습니다.</EmptyState>
              )}
            </TableCard>
          </TableSection>

          {selectedTx && (
            <PanelCard padding={0}>
              <PanelHeader>
                <PanelTitle>거래 상세</PanelTitle>
                <CloseBtn type="button" onClick={() => setSelectedId(null)}>
                  ×
                </CloseBtn>
              </PanelHeader>
              <Divider />

              <PanelBody>
                <BadgeRow>
                  <Tag
                    variant="platform"
                    value={platformLabel(selectedTx.platform)}
                  />
                  <Tag variant="type" value={typeLabel(selectedTx.type)} />
                </BadgeRow>

                <TxName>{selectedTx.title}</TxName>

                <DateAmountRow>
                  <TxDate>{selectedTx.date}</TxDate>
                  <Sep>|</Sep>
                  <TxAmount
                    $type={selectedTx.type}
                    $statusTag={selectedTx.statusTag}
                  >
                    {formatAmount(selectedTx.amount, selectedTx.type)}
                  </TxAmount>
                </DateAmountRow>

                <Divider />

                <SectionLabel>상품 목록</SectionLabel>
                {selectedTx.products?.length ? (
                  selectedTx.products.map((product) => (
                    <ProductItem key={product.id}>
                      <span>{product.name}</span>
                      <span>{`₩${product.price.toLocaleString("ko-KR")}`}</span>
                    </ProductItem>
                  ))
                ) : (
                  <EmptyNote>등록된 상품이 없습니다.</EmptyNote>
                )}

                <Divider style={{ margin: "16px 0" }} />

                <SectionLabel>거래 상태</SectionLabel>
                <Tag
                  variant="status"
                  value={statusLabel(selectedTx.statusTag)}
                />

                <Divider style={{ margin: "16px 0" }} />

                <SectionLabel>입력 방식</SectionLabel>
                <Tag
                  variant="source"
                  value={selectedTx.source === "ocr" ? "OCR" : "직접"}
                />

                <Divider style={{ margin: "16px 0" }} />

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  style={{ marginBottom: 12 }}
                >
                  거래 수정하기
                </Button>
                <DeleteBtn type="button">거래 삭제</DeleteBtn>

                <LinkAction type="button">
                  상품 링크 보기 / 직접 입력
                </LinkAction>
              </PanelBody>
            </PanelCard>
          )}
        </ContentRow>
      </PageLayout>
    </AppShell>
  );
};
