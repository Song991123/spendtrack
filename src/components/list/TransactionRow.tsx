/**
 * 역할: 목록형 데이터를 한 줄 또는 한 블록 단위로 보여주는 공통 컴포넌트입니다.
 * 위치: src\components\list\TransactionRow.tsx
 */
import styled from "styled-components";
import PlatformBadge from "../display/PlatformBadge";
import { tokens } from "../../styles/tokens";

interface TransactionRowProps {
  item: {
    id: string;
    productName: string;
    platform: "쿠팡" | "네이버쇼핑" | "무신사";
    category: string;
    amount: number;
    purchasedAt: string;
  };
}

const Row = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid ${tokens.color.line2};

  &:last-child {
    border-bottom: none;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Product = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${tokens.color.ink1};
`;

const Price = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${tokens.color.ink1};
`;

const Bottom = styled.div`
  margin-top: 4px;
`;

function formatKRW(value: number) {
  return `${value.toLocaleString()}원`;
}

export default function TransactionRow({ item }: TransactionRowProps) {
  return (
    <Row>
      <Top>
        <Product>{item.productName}</Product>
        <Price>{formatKRW(item.amount)}</Price>
      </Top>

      <Bottom>
        <PlatformBadge platform={item.platform} />
      </Bottom>
    </Row>
  );
}

