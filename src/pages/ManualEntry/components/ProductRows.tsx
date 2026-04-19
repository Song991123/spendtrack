/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\ManualEntry\components\ProductRows.tsx
 */
import React from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";

export interface ManualProduct {
  id: string;
  name: string;
  price: number;
  link?: string;
}

const Wrap = styled.div`
  margin-bottom: 16px;
  border-top: 1px solid ${tokens.color.line2};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 50px 24px;
  gap: 12px;
  align-items: center;
  padding: 10px 4px;
  border-bottom: 1px solid ${tokens.color.line2};
  font-size: 13px;
`;

const Name = styled.span`
  color: ${tokens.color.ink1};
  font-weight: 500;
`;

const Price = styled.span`
  color: ${tokens.color.ink1};
  font-family: ${tokens.font.mono};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

const LinkButton = styled.button`
  border: none;
  background: none;
  color: ${tokens.color.accentHover};
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
`;

const RemoveButton = styled.button`
  border: none;
  background: none;
  color: ${tokens.color.ink4};
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: ${tokens.color.neg};
  }
`;

const Empty = styled.div`
  padding: 20px 4px;
  color: ${tokens.color.ink4};
  text-align: center;
  font-size: 12px;
`;

export const ProductRows: React.FC<{
  products: ManualProduct[];
  onRemove: (id: string) => void;
}> = ({ products, onRemove }) => (
  <Wrap>
    {products.length === 0 ? (
      <Empty>아직 등록된 상품이 없어요.</Empty>
    ) : (
      products.map((product) => (
        <Row key={product.id}>
          <Name>{product.name}</Name>
          <Price>₩{product.price.toLocaleString("ko-KR")}</Price>
          <LinkButton type="button">링크</LinkButton>
          <RemoveButton type="button" onClick={() => onRemove(product.id)}>
            ×
          </RemoveButton>
        </Row>
      ))
    )}
  </Wrap>
);

