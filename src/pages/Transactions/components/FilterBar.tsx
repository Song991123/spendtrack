import React from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";

const Bar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
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
    border-radius: 8px;
    background: ${tokens.color.panel};
    color: ${tokens.color.ink1};
    font-size: 13px;
    outline: none;
    transition: border-color 0.12s, box-shadow 0.12s;
  }

  .input:focus {
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

const Select = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid ${tokens.color.line};
  border-radius: 8px;
  background: ${tokens.color.panel};
  color: ${tokens.color.ink2};
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
`;

const Total = styled.div`
  margin-left: 4px;
  color: ${tokens.color.ink4};
  font-size: 12px;

  ${media.tablet} {
    margin-left: 0;
  }
`;

export const FilterBar: React.FC<{ totalLabel: string }> = ({ totalLabel }) => (
  <Bar>
    <Search>
      <span className="icon">⌕</span>
      <input className="input" placeholder="주문명·상품명 검색" />
    </Search>
    <Select type="button">기간 선택 ▾</Select>
    <Select type="button">플랫폼 전체 ▾</Select>
    <Select type="button">카테고리 ▾</Select>
    <Total>{totalLabel}</Total>
  </Bar>
);
