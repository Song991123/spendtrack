/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Transactions\components\TransactionTable.tsx
 */
import React, { useEffect, useRef } from "react";
import styled, { css, keyframes } from "styled-components";
import { Card } from "../../../components/primitives/Card";
import { Tag } from "../../../components/primitives/Tag";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";
import { formatKRW } from "../../../utils/format";
import { PLATFORM_LABELS, STATUS_LABELS, TYPE_LABELS } from "../../../constants/labels";

export type TxType = "expense" | "income";
export type TxPlatform = "coupang" | "naver" | "musinsa";
export type TxStatus = "purchase" | "cancel" | "refund" | "sub";
export type TxCategory = "living" | "fashion" | "digital" | "food";

export type TxSource = "mock" | "csv" | "ocr" | "manual";

export interface TxRow {
  id: string;
  type: TxType;
  date: string;
  platform: TxPlatform;
  category: TxCategory;
  title: string;
  amount: number;
  status: TxStatus;
  /**
   * 거래가 어떤 반입 경로로 생성됐는지 표시합니다.
   * mock: 초기 시드, csv: 카드 CSV 업로드, ocr: OCR 저장, manual: 수동 입력.
   */
  source?: TxSource;
  detail?: {
    items: { name: string; price: number }[];
    source?: "OCR" | "MANUAL";
  };
}

const Table = styled.div`
  display: grid;
  grid-template-columns: 72px 110px 110px 1fr 140px 80px;
  font-size: 13px;

  ${media.tablet} {
    grid-template-columns: 72px 96px 96px 1fr 132px 80px;
  }
`;

const HeaderCell = styled.div`
  padding: 10px 14px;
  background: ${tokens.color.foot};
  border-bottom: 1px solid ${tokens.color.line2};
  color: ${tokens.color.ink4};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  &.right {
    text-align: right;
  }
`;

const DataCell = styled.div<{ $right?: boolean; $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid ${tokens.color.line2};
  color: ${tokens.color.ink1};
  transition: background ${tokens.motion.fast} ease;
  ${({ $right }) =>
    $right &&
    css`
      justify-content: flex-end;
    `}
  ${({ $active }) =>
    $active &&
    css`
      background: ${tokens.color.accentSubtle};
    `}
`;

const Amount = styled.span<{ $positive?: boolean }>`
  color: ${({ $positive }) => ($positive ? tokens.color.pos : tokens.color.ink1)};
  font-family: ${tokens.font.mono};
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: ${tokens.color.ink4};
  font-size: 12px;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  border: 2px solid ${tokens.color.line};
  border-top-color: ${tokens.color.accent};
  border-radius: 50%;
  animation: ${spin} 600ms linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

interface Props {
  rows: TxRow[];
  totalCount: number;
  selectedId: string;
  onSelect: (id: string) => void;
  onLoadMore: () => void;
}

export const TransactionTable: React.FC<Props> = ({
  rows,
  totalCount,
  selectedId,
  onSelect,
  onLoadMore,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = rows.length < totalCount;
  const loadMoreRef = useRef(onLoadMore);
  loadMoreRef.current = onLoadMore;

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreRef.current();
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <Card padding={0}>
      <Table>
        <HeaderCell>유형</HeaderCell>
        <HeaderCell>주문일</HeaderCell>
        <HeaderCell>플랫폼</HeaderCell>
        <HeaderCell>거래명</HeaderCell>
        <HeaderCell className="right">금액</HeaderCell>
        <HeaderCell>상태</HeaderCell>
        {rows.map((row) => {
          const active = row.id === selectedId;
          const common = {
            $active: active,
            onClick: () => onSelect(row.id),
            style: { cursor: "pointer" },
          };

          return (
            <React.Fragment key={row.id}>
              <DataCell {...common}>
                <Tag kind={row.type === "expense" ? "expense" : "income"}>
                  {TYPE_LABELS[row.type]}
                </Tag>
              </DataCell>
              <DataCell {...common}>{row.date}</DataCell>
              <DataCell {...common}>
                <Tag kind={row.platform}>{PLATFORM_LABELS[row.platform]}</Tag>
              </DataCell>
              <DataCell {...common}>{row.title}</DataCell>
              <DataCell {...common} $right>
                <Amount $positive={row.amount > 0}>
                  {row.amount > 0 ? "+" : "-"}
                  {formatKRW(Math.abs(row.amount))}
                </Amount>
              </DataCell>
              <DataCell {...common}>
                <Tag kind={row.status}>{STATUS_LABELS[row.status]}</Tag>
              </DataCell>
            </React.Fragment>
          );
        })}
      </Table>
      {rows.length === 0 ? (
        <Footer>조건에 맞는 거래가 없어요</Footer>
      ) : hasMore ? (
        <Footer ref={sentinelRef}>
          <Spinner aria-hidden="true" />
          거래를 불러오는 중…
        </Footer>
      ) : (
        <Footer>모든 거래를 확인했어요 · 총 {totalCount}건</Footer>
      )}
    </Card>
  );
};

