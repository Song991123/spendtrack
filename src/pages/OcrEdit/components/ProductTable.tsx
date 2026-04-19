import React from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";
import type { OcrProduct } from "../data";

const Table = styled.div`
  display: grid;
  grid-template-columns: 1fr 110px 90px 24px;
  font-size: 12.5px;
`;

const HeaderCell = styled.div`
  padding: 8px 4px;
  border-bottom: 1px solid ${tokens.color.line2};
  color: ${tokens.color.ink4};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  &.right {
    text-align: right;
  }
`;

const Row = styled.div`
  display: contents;

  & > * {
    padding: 8px 4px;
    border-bottom: 1px solid ${tokens.color.line2};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid ${tokens.color.line};
  border-radius: 6px;
  background: ${tokens.color.panel};
  color: ${tokens.color.ink1};
  font-family: inherit;
  font-size: 12.5px;
  outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;

  &:focus {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }

  &.amount {
    text-align: right;
    font-family: ${tokens.font.mono};
    font-variant-numeric: tabular-nums;
  }

  &.link {
    color: ${tokens.color.ink4};
    font-size: 11px;
  }
`;

const RemoveButton = styled.button`
  border: none;
  background: none;
  color: ${tokens.color.ink4};
  cursor: pointer;
  font-size: 14px;

  &:hover {
    color: ${tokens.color.neg};
  }
`;

const AddRow = styled.button`
  grid-column: 1 / -1;
  margin-top: 10px;
  padding: 10px;
  border: 1px dashed ${tokens.color.line};
  border-radius: 8px;
  background: ${tokens.color.panel};
  color: ${tokens.color.ink3};
  cursor: pointer;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;

  &:hover {
    border-color: ${tokens.color.accent};
    color: ${tokens.color.accentHover};
  }
`;

export const ProductTable: React.FC<{ products: OcrProduct[] }> = ({ products }) => (
  <Table>
    <HeaderCell>상품명</HeaderCell>
    <HeaderCell className="right">상품 금액</HeaderCell>
    <HeaderCell>상품 링크</HeaderCell>
    <HeaderCell />
    {products.map((product) => (
      <Row key={product.id}>
        <div>
          <Input defaultValue={product.name} />
        </div>
        <div>
          <Input className="amount" defaultValue={product.price.toLocaleString("ko-KR")} />
        </div>
        <div>
          <Input className="link" placeholder="URL (선택)" defaultValue={product.link ?? ""} />
        </div>
        <div style={{ display: "grid", placeItems: "center" }}>
          <RemoveButton type="button">×</RemoveButton>
        </div>
      </Row>
    ))}
    <AddRow type="button">+ 상품 직접 추가하기</AddRow>
  </Table>
);
