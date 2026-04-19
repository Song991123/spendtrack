import React from "react";
import styled from "styled-components";
import { Card, CardBd, CardHd } from "../../../components/primitives/Card";
import { Tag } from "../../../components/primitives/Tag";
import { Button } from "../../../components/primitives/Button";
import { tokens } from "../../../styles/tokens";
import { formatKRW } from "../../../utils/format";
import type { TxRow } from "./TransactionTable";
import { PLATFORM_LABELS, SOURCE_LABELS, STATUS_LABELS, TYPE_LABELS } from "../../../constants/labels";

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .title {
    color: ${tokens.color.ink2};
    font-size: 13px;
    font-weight: 600;
  }

  .close {
    border: none;
    background: none;
    color: ${tokens.color.ink4};
    cursor: pointer;
    font-size: 16px;
  }
`;

const Tags = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
`;

const Title = styled.div`
  margin-bottom: 4px;
  color: ${tokens.color.ink1};
  font-size: 15px;
  font-weight: 600;
`;

const DateAmount = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;

  .date {
    color: ${tokens.color.ink4};
    font-size: 12px;
  }

  .amount {
    color: ${tokens.color.ink1};
    font-family: ${tokens.font.mono};
    font-size: 16px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
`;

const Section = styled.div`
  padding: 12px 0;
  border-top: 1px solid ${tokens.color.line2};

  &:first-child {
    padding-top: 0;
    border-top: none;
  }

  .label {
    margin-bottom: 8px;
    color: ${tokens.color.ink4};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
  color: ${tokens.color.ink2};
  font-size: 13px;

  .price {
    color: ${tokens.color.ink1};
    font-family: ${tokens.font.mono};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

const Actions = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 4px;
`;

const LinkButton = styled.button`
  margin-top: 10px;
  border: none;
  background: transparent;
  padding: 0;
  color: ${tokens.color.accentHover};
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
`;

export const DetailPanel: React.FC<{
  row: TxRow;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenSource: () => void;
}> = ({ row, onClose, onEdit, onDelete, onOpenSource }) => (
  <Card padding={0}>
    <CardHd>
      <HeaderRow>
        <span className="title">거래 상세</span>
        <button className="close" type="button" onClick={onClose}>
          ×
        </button>
      </HeaderRow>
    </CardHd>
    <CardBd>
      <Tags>
        <Tag kind={row.platform}>{PLATFORM_LABELS[row.platform]}</Tag>
        <Tag kind={row.type === "expense" ? "expense" : "income"}>{TYPE_LABELS[row.type]}</Tag>
      </Tags>
      <Title>{row.title}</Title>
      <DateAmount>
        <span className="date">{row.date}</span>
        <span className="amount" style={{ color: row.amount > 0 ? tokens.color.pos : tokens.color.ink1 }}>
          {row.amount > 0 ? "+" : "-"}
          {formatKRW(Math.abs(row.amount))}
        </span>
      </DateAmount>

      {row.detail?.items.length ? (
        <Section>
          <div className="label">상품 목록</div>
          {row.detail.items.map((item, index) => (
            <ItemRow key={`${item.name}-${index}`}>
              <span>{item.name}</span>
              <span className="price">{formatKRW(item.price)}</span>
            </ItemRow>
          ))}
        </Section>
      ) : null}

      <Section>
        <div className="label">거래 상태</div>
        <Tag kind={row.status}>{STATUS_LABELS[row.status]}</Tag>
      </Section>

      {row.detail?.source && (
        <Section>
          <div className="label">입력 방식</div>
          <Tag kind="purchase">{SOURCE_LABELS[row.detail.source]}</Tag>
        </Section>
      )}

      <Actions>
        <Button variant="primary" size="lg" block onClick={onEdit}>
          수정하기
        </Button>
        <Button variant="danger" size="lg" block onClick={onDelete}>
          거래 삭제
        </Button>
      </Actions>

      {row.detail?.source === "OCR" && (
        <LinkButton type="button" onClick={onOpenSource}>
          OCR 결과 화면으로 이동
        </LinkButton>
      )}
    </CardBd>
  </Card>
);
