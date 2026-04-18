import styled from "styled-components";
import PlatformBadge from "../display/PlatformBadge";

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
  border-bottom: 1px solid #f3f4f6;

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
  color: #111827;
`;

const Price = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
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