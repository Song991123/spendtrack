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
import {
  CATEGORY_LABELS,
  PLATFORM_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from "../../../constants/labels";
import { useCategoryColorMap } from "../../../stores/categoriesStore";

export type TxType = "expense" | "income";
export type TxPlatform = "coupang" | "naver" | "musinsa";
export type TxStatus = "purchase" | "cancel" | "refund" | "sub";
/**
 * "etc"(기타)는 사용자가 카테고리를 지정하지 않은 모든 거래의 안전한 기본값입니다.
 * CSV/OCR/수동 입력 모든 경로에서 카테고리가 비었거나 알 수 없으면 "etc"로 수렴시킵니다.
 */
export type TxCategory = "living" | "fashion" | "digital" | "food" | "etc";

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
  /* 7번째 컬럼(카테고리 색)은 거래명과 금액 사이에 좁게 끼워 넣어서, 색 박스 + hover 툴팁만 담당합니다. */
  grid-template-columns: 76px 110px 108px 1fr 52px 140px 96px;
  font-size: 13px;

  ${media.tablet} {
    grid-template-columns: 76px 96px 100px 1fr 44px 132px 96px;
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
 * 정렬이 가능한 헤더 셀. 버튼 형태로 포커스/호버 피드백을 주고
 * 화살표 아이콘이 붙어 현재 정렬 방향을 시각적으로 표시합니다.
 */
const SortableHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: ${tokens.color.foot};
  border: none;
  border-bottom: 1px solid ${tokens.color.line2};
  color: ${tokens.color.ink4};
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-align: left;
  text-transform: uppercase;
  transition: color ${tokens.motion.fast} ease;

  &:hover,
  &:focus-visible {
    color: ${tokens.color.ink1};
    outline: none;
  }

  &:focus-visible {
    box-shadow: ${tokens.shadow.focus};
  }
`;

const SortIcon = styled.span<{ $dir: "desc" | "asc" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.color.accent};
  /* desc(내림차순): 아래 화살표, asc(오름차순): 위로 뒤집어 보여줍니다. */
  transform: ${({ $dir }) => ($dir === "desc" ? "rotate(0deg)" : "rotate(180deg)")};
  transition: transform ${tokens.motion.fast} ease;
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

/**
 * 카테고리 색상 셀의 hover 범위. 색상 정사각형 위에 마우스가 오면 카테고리 이름 툴팁을
 * 위쪽에 띄워 보여줍니다. 포지셔닝을 위해 relative를 걸어두고, 툴팁의 기준점이 됩니다.
 */
const CategoryCell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 부모 DataCell 폭을 가득 채워 색상 정사각형이 컬럼 정중앙에 오게 합니다. */
  width: 100%;
`;

/**
 * 카테고리 색을 보여주는 정사각형. 각 행에서 "이 거래가 어느 카테고리인지"를
 * 최소 시각 노이즈로 전달하는 역할이라 테두리 없이 배경색만 씁니다.
 */
const ColorSquare = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
  /* 배경과 섞이지 않도록 아주 연한 윤곽선을 깔아 둡니다. 흰 배경에도, hover 배경에도 안정적입니다. */
  box-shadow: inset 0 0 0 1px rgba(16, 24, 40, 0.08);
`;

/**
 * 카테고리 이름을 카테고리 색으로 보여주는 툴팁.
 * 평소엔 hidden, 부모(CategoryCell) hover 시에만 opacity/translate로 부드럽게 등장합니다.
 * 색상 가독성을 위해 흰 배경/그림자를 깔고 글씨만 해당 카테고리 색으로 강조합니다.
 */
const CategoryTooltip = styled.span<{ $color: string }>`
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translate(-50%, 4px);
  padding: 4px 8px;
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.control};
  background: ${tokens.color.panel};
  box-shadow: ${tokens.shadow.cardHover};
  color: ${({ $color }) => $color};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity ${tokens.motion.fast} ease,
    transform ${tokens.motion.fast} ease;
  z-index: 2;

  ${CategoryCell}:hover & {
    opacity: 1;
    transform: translate(-50%, 0);
  }
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
  /** "desc"면 최신이 위, "asc"면 과거가 위에 옵니다. */
  sortOrder: "desc" | "asc";
  /** 정렬 방향을 뒤집습니다. */
  onToggleSort: () => void;
}

export const TransactionTable: React.FC<Props> = ({
  rows,
  totalCount,
  selectedId,
  onSelect,
  onLoadMore,
  sortOrder,
  onToggleSort,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string>("");
  // 카테고리 색상은 설정 화면에서 사용자가 편집할 수 있으므로, 직접 스토어를 구독해 즉시 반영합니다.
  const categoryColorMap = useCategoryColorMap();
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
        <SortableHeader
          type="button"
          onClick={onToggleSort}
          aria-label={
            sortOrder === "desc"
              ? "주문일 내림차순, 오름차순으로 바꾸기"
              : "주문일 오름차순, 내림차순으로 바꾸기"
          }
          aria-pressed={sortOrder === "asc"}
        >
          주문일
          <SortIcon $dir={sortOrder} aria-hidden="true">
            <svg width={12} height={12} viewBox="0 0 12 12">
              {/* 기본 방향은 아래를 가리키는 셰브런. asc일 때 CSS 회전으로 뒤집습니다. */}
              <polyline
                points="3 4.5 6 7.5 9 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SortIcon>
        </SortableHeader>
        <HeaderCell className="tag">플랫폼</HeaderCell>
        <HeaderCell>거래명</HeaderCell>
        {/* 카테고리 컬럼은 색상 정사각형만 표시하고 제목도 짧게 표기합니다. */}
        <HeaderCell style={{ textAlign: "center", padding: "10px 0" }}>분류</HeaderCell>
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
              <DataCell {...common} style={{ ...common.style, padding: "12px 0" }}>
                {/* 색상 정사각형 + hover 툴팁. 툴팁 글씨는 해당 카테고리 색으로 나와 시각 연관을 만듭니다. */}
                <CategoryCell>
                  <ColorSquare
                    $color={categoryColorMap[row.category]}
                    aria-label={CATEGORY_LABELS[row.category]}
                  />
                  <CategoryTooltip
                    role="tooltip"
                    $color={categoryColorMap[row.category]}
                  >
                    {CATEGORY_LABELS[row.category]}
                  </CategoryTooltip>
                </CategoryCell>
              </DataCell>
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

