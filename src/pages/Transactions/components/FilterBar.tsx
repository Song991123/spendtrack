/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Transactions\components\FilterBar.tsx
 */
import styled from "styled-components";
import { CATEGORY_LABELS, PLATFORM_LABELS, STATUS_LABELS } from "../../../constants/labels";
import { SegmentedControl } from "../../../components/primitives/SegmentedControl";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";
import type { TxCategory, TxPlatform, TxStatus, TxType } from "./TransactionTable";

export type TypeFilter = "all" | TxType;
export type StatusFilter = "all" | TxStatus;

interface FilterBarProps {
  search: string;
  typeFilter: TypeFilter;
  platform: "all" | TxPlatform;
  category: "all" | TxCategory;
  statusFilter: StatusFilter;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: TypeFilter) => void;
  onPlatformChange: (value: "all" | TxPlatform) => void;
  onCategoryChange: (value: "all" | TxCategory) => void;
  onStatusChange: (value: StatusFilter) => void;
}

const TYPE_OPTIONS: Array<{ value: TypeFilter; label: string }> = [
  { value: "all", label: "전체" },
  { value: "expense", label: "지출" },
  { value: "income", label: "수입" },
];

const Bar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto auto auto;
  gap: 8px;
  align-items: center;

  ${media.tablet} {
    grid-template-columns: minmax(0, 1fr) auto;
    row-gap: 10px;
  }

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Search = styled.div`
  position: relative;

  .input {
    width: 100%;
    height: 34px;
    padding: 0 12px 0 34px;
    border: 1px solid ${tokens.color.line};
    border-radius: ${tokens.radius.control};
    background: ${tokens.color.panel};
    color: ${tokens.color.ink1};
    font-size: ${tokens.type.bodySm.size};
    outline: none;
    transition: border-color ${tokens.motion.fast}, box-shadow ${tokens.motion.fast};
  }

  .input:hover {
    border-color: ${tokens.color.ink5};
  }

  .input:focus,
  .input:focus-visible {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }

  .input:focus ~ .icon {
    color: ${tokens.color.accent};
  }

  .input::placeholder {
    color: ${tokens.color.ink5};
  }

  .icon {
    position: absolute;
    left: 10px;
    top: 50%;
    width: 14px;
    height: 14px;
    transform: translateY(-50%);
    color: ${tokens.color.ink4};
    pointer-events: none;
    transition: color ${tokens.motion.fast} ease;
  }
`;

/** 레퍼런스의 `btn-ghost ▾` 드롭다운 버튼 느낌으로 스타일한 네이티브 select. */
const Select = styled.select`
  height: 34px;
  padding: 0 28px 0 12px;
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.control};
  background-color: ${tokens.color.panel};
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none' stroke='%238A94A6' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M1 1l4 4 4-4'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  color: ${tokens.color.ink2};
  font-family: inherit;
  font-size: ${tokens.type.caption.size};
  font-weight: 600;
  outline: none;
  cursor: pointer;
  appearance: none;
  transition:
    border-color ${tokens.motion.fast} ease,
    box-shadow ${tokens.motion.fast} ease,
    color ${tokens.motion.fast} ease;

  &:hover {
    border-color: ${tokens.color.ink5};
    color: ${tokens.color.ink1};
  }

  &:focus,
  &:focus-visible {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }
`;

export const FilterBar = ({
  search,
  typeFilter,
  platform,
  category,
  statusFilter,
  onSearchChange,
  onTypeChange,
  onPlatformChange,
  onCategoryChange,
  onStatusChange,
}: FilterBarProps) => (
  <Bar>
    <Search>
      <input
        className="input"
        placeholder="주문명·상품명 검색"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <svg
        className="icon"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="5" />
        <path d="M11 11l3 3" />
      </svg>
    </Search>
    <SegmentedControl value={typeFilter} options={TYPE_OPTIONS} onChange={onTypeChange} />
    <Select
      value={platform}
      onChange={(event) => onPlatformChange(event.target.value as "all" | TxPlatform)}
    >
      <option value="all">플랫폼 전체</option>
      <option value="coupang">{PLATFORM_LABELS.coupang}</option>
      <option value="naver">{PLATFORM_LABELS.naver}</option>
      <option value="musinsa">{PLATFORM_LABELS.musinsa}</option>
    </Select>
    <Select
      value={category}
      onChange={(event) => onCategoryChange(event.target.value as "all" | TxCategory)}
    >
      <option value="all">카테고리 전체</option>
      <option value="living">{CATEGORY_LABELS.living}</option>
      <option value="fashion">{CATEGORY_LABELS.fashion}</option>
      <option value="digital">{CATEGORY_LABELS.digital}</option>
      <option value="food">{CATEGORY_LABELS.food}</option>
      {/* "기타"는 카테고리 미지정 거래를 걸러볼 수 있는 단일 진입점입니다. */}
      <option value="etc">{CATEGORY_LABELS.etc}</option>
    </Select>
    <Select
      value={statusFilter}
      onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
    >
      <option value="all">상태 전체</option>
      <option value="purchase">{STATUS_LABELS.purchase}</option>
      <option value="cancel">{STATUS_LABELS.cancel}</option>
      <option value="refund">{STATUS_LABELS.refund}</option>
      <option value="sub">{STATUS_LABELS.sub}</option>
      {/* "기타" 상태는 지출·수입 양쪽 폴백이라 상태 필터에도 노출해 수동 입력 정리에 쓰도록 합니다. */}
      <option value="etc">{STATUS_LABELS.etc}</option>
    </Select>
  </Bar>
);
