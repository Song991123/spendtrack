/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Transactions\components\TransactionTable.tsx
 */
import React, { useEffect, useRef, useState } from "react";
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
  /** 수동 입력 시 작성한 메모. 레퍼런스 상세 패널에 노출됩니다. */
  memo?: string;
  detail?: {
    items: { name: string; price: number; link?: string }[];
    source?: "OCR" | "MANUAL";
  };
}

const Table = styled.div`
  display: grid;
  grid-template-columns: 76px 110px 108px 1fr 140px 96px;
  font-size: 13px;

  ${media.tablet} {
    grid-template-columns: 76px 96px 100px 1fr 132px 96px;
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

  /* Tag 내부 7px 패딩만큼 헤더 텍스트 시작점도 밀어 데이터와 정렬을 맞춥니다. */
  &.tag {
    padding-left: 21px;
  }

  &.right {
    text-align: right;
  }
`;

/**
 * 첫 렌더에서 등장하는 행들에 위에서 살짝 내려앉는 효과를 주기 위한 키프레임입니다.
 * 방금 추가된 것처럼 보이도록 6px → 0px로 올라오며 opacity가 차오릅니다.
 */
const rowEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

const DataCell = styled.div<{
  $right?: boolean;
  $active?: boolean;
  $hovered?: boolean;
  /** 행의 인덱스. undefined이거나 BATCH_SIZE 이상이면 애니메이션을 적용하지 않습니다. */
  $enterIndex?: number;
}>`
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
  ${({ $active, $hovered }) =>
    $active
      ? css`
          background: ${tokens.color.accentSubtle};
        `
      : $hovered
        ? css`
            background: ${tokens.color.foot};
          `
        : ""}
  /* $enterIndex가 들어온 행(첫 배치)만 지연 시간을 누적해 순차 등장하게 합니다. */
  ${({ $enterIndex }) =>
    typeof $enterIndex === "number" &&
    $enterIndex >= 0 &&
    css`
      animation: ${rowEnter} 360ms ease-out both;
      animation-delay: ${$enterIndex * 22}ms;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `}
`;

const Amount = styled.span<{ $positive?: boolean }>`
  color: ${({ $positive }) => ($positive ? tokens.color.pos : tokens.color.neg)};
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
  const [hoveredId, setHoveredId] = useState<string>("");
  const hasMore = rows.length < totalCount;
  const loadMoreRef = useRef(onLoadMore);
  loadMoreRef.current = onLoadMore;

  /**
   * 첫 마운트 시 노출된 행 ID들만 기록해 둡니다.
   * 이후 인피니트 스크롤로 추가되는 행은 이 집합에 들어있지 않으므로 애니메이션을 받지 않고,
   * 필터/월 변경으로 리셋된 경우에도 이전에 본 행은 다시 애니메이션하지 않습니다.
   */
  const initialIdsRef = useRef<Set<string> | null>(null);
  if (initialIdsRef.current === null) {
    initialIdsRef.current = new Set(rows.map((row) => row.id));
  }
  const initialIds = initialIdsRef.current;

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
        <HeaderCell className="tag">유형</HeaderCell>
        <HeaderCell>주문일</HeaderCell>
        <HeaderCell className="tag">플랫폼</HeaderCell>
        <HeaderCell>거래명</HeaderCell>
        <HeaderCell className="right">금액</HeaderCell>
        <HeaderCell className="tag">상태</HeaderCell>
        {rows.map((row, rowIndex) => {
          const active = row.id === selectedId;
          const hovered = row.id === hoveredId && !active;
          /**
           * 첫 렌더에서 잡힌 행 중 현재 위치에 있는 경우에만 stagger 인덱스를 내려보냅니다.
           * 인피니트 스크롤로 추가된 행이나 필터 변경 후 새로 등장한 행은 undefined가 되어
           * 애니메이션이 발동하지 않습니다.
           */
          const enterIndex = initialIds.has(row.id) ? rowIndex : undefined;
          const common = {
            $active: active,
            $hovered: hovered,
            $enterIndex: enterIndex,
            onClick: () => onSelect(row.id),
            onMouseEnter: () => setHoveredId(row.id),
            onMouseLeave: () =>
              setHoveredId((current) => (current === row.id ? "" : current)),
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

