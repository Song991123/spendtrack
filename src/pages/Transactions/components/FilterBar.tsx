/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Transactions\components\FilterBar.tsx
 */
import styled from "styled-components";
import { CATEGORY_LABELS, PLATFORM_LABELS } from "../../../constants/labels";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";
import type { TxCategory, TxPlatform } from "./TransactionTable";

interface FilterBarProps {
  totalLabel: string;
  search: string;
  platform: "all" | TxPlatform;
  category: "all" | TxCategory;
  onSearchChange: (value: string) => void;
  onPlatformChange: (value: "all" | TxPlatform) => void;
  onCategoryChange: (value: "all" | TxCategory) => void;
}

const Bar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) repeat(2, minmax(120px, auto)) auto;
  gap: 10px;
  align-items: center;

  ${media.tablet} {
    grid-template-columns: 1fr 1fr;
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

  .input:focus,
  .input:focus-visible {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }

  .input::placeholder {
    color: ${tokens.color.ink5};
  }

  .icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: ${tokens.color.ink4};
    font-size: 14px;
  }
`;

const Select = styled.select`
  height: 34px;
  padding: 0 12px;
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.control};
  background: ${tokens.color.panel};
  color: ${tokens.color.ink2};
  font-family: inherit;
  font-size: ${tokens.type.bodySm.size};
  font-weight: 500;
  outline: none;
  cursor: pointer;

  &:focus,
  &:focus-visible {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }
`;

const Total = styled.div`
  margin-left: 4px;
  color: ${tokens.color.ink4};
  font-size: ${tokens.type.caption.size};

  ${media.tablet} {
    margin-left: 0;
  }
`;

export const FilterBar = ({
  totalLabel,
  search,
  platform,
  category,
  onSearchChange,
  onPlatformChange,
  onCategoryChange,
}: FilterBarProps) => (
  <Bar>
    <Search>
      <span className="icon" aria-hidden="true">
        ⌕
      </span>
      <input
        className="input"
        placeholder="거래명 또는 상품명 검색"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </Search>
    <Select value={platform} onChange={(event) => onPlatformChange(event.target.value as "all" | TxPlatform)}>
      <option value="all">플랫폼 전체</option>
      <option value="coupang">{PLATFORM_LABELS.coupang}</option>
      <option value="naver">{PLATFORM_LABELS.naver}</option>
      <option value="musinsa">{PLATFORM_LABELS.musinsa}</option>
    </Select>
    <Select value={category} onChange={(event) => onCategoryChange(event.target.value as "all" | TxCategory)}>
      <option value="all">카테고리 전체</option>
      <option value="living">{CATEGORY_LABELS.living}</option>
      <option value="fashion">{CATEGORY_LABELS.fashion}</option>
      <option value="digital">{CATEGORY_LABELS.digital}</option>
      <option value="food">{CATEGORY_LABELS.food}</option>
    </Select>
    <Total>{totalLabel}</Total>
  </Bar>
);

