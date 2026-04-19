import React from "react";
import styled, { css } from "styled-components";
import { Card } from "../../../components/primitives/Card";
import { Tag } from "../../../components/primitives/Tag";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";
import { formatKRW } from "../../../utils/format";

export type TxType = "expense" | "income";
export type TxPlatform = "coupang" | "naver" | "musinsa";
export type TxStatus = "purchase" | "cancel" | "refund" | "sub";

export interface TxRow {
  id: string;
  type: TxType;
  date: string;
  platform: TxPlatform;
  title: string;
  amount: number;
  status: TxStatus;
  detail?: {
    items: { name: string; price: number }[];
    source?: "OCR" | "MANUAL";
  };
}

const PLATFORM_LABEL: Record<TxPlatform, string> = {
  coupang: "쿠팡",
  naver: "네이버쇼핑",
  musinsa: "무신사",
};

const STATUS_LABEL: Record<TxStatus, string> = {
  purchase: "구매",
  cancel: "취소",
  refund: "환불",
  sub: "정기결제",
};

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

export const TransactionTable: React.FC<{
  rows: TxRow[];
  selectedId: string;
  onSelect: (id: string) => void;
}> = ({ rows, selectedId, onSelect }) => (
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
                {row.type === "expense" ? "지출" : "수입"}
              </Tag>
            </DataCell>
            <DataCell {...common}>{row.date}</DataCell>
            <DataCell {...common}>
              <Tag kind={row.platform}>{PLATFORM_LABEL[row.platform]}</Tag>
            </DataCell>
            <DataCell {...common}>{row.title}</DataCell>
            <DataCell {...common} $right>
              <Amount $positive={row.amount > 0}>
                {row.amount > 0 ? "+" : "-"}
                {formatKRW(Math.abs(row.amount))}
              </Amount>
            </DataCell>
            <DataCell {...common}>
              <Tag kind={row.status}>{STATUS_LABEL[row.status]}</Tag>
            </DataCell>
          </React.Fragment>
        );
      })}
    </Table>
  </Card>
);
