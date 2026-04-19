/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 *       OCR 추출 결과를 보여주고 주문일자를 수정할 수 있도록 인풋으로 제공합니다.
 * 위치: src\pages\OcrEdit\components\EditForm.tsx
 */
import React from "react";
import styled from "styled-components";
import { Card, CardBd } from "../../../components/primitives/Card";
import { Tag } from "../../../components/primitives/Tag";
import { tokens } from "../../../styles/tokens";
import type { OcrImageItem } from "../data";
import { ProductTable } from "./ProductTable";
import { PLATFORM_LABELS, STATUS_LABELS } from "../../../constants/labels";

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${tokens.color.line2};
`;

const MetaCell = styled.div`
  .label {
    color: ${tokens.color.ink4};
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .value {
    margin-top: 2px;
    color: ${tokens.color.ink1};
    font-size: 12.5px;
    font-weight: 500;
  }
`;

const DateInput = styled.input`
  margin-top: 2px;
  width: 120px;
  padding: 4px 6px;
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.control};
  background: ${tokens.color.panel};
  color: ${tokens.color.ink1};
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 500;
  outline: none;
  transition:
    border-color ${tokens.motion.fast} ease,
    box-shadow ${tokens.motion.fast} ease;

  &:focus,
  &:focus-visible {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }
`;

const MetaSeparator = styled.span`
  width: 1px;
  height: 24px;
  background: ${tokens.color.line2};
`;

const Total = styled.div`
  margin-bottom: 16px;
  padding: 8px 0 4px;

  .label {
    margin-bottom: 4px;
    color: ${tokens.color.ink4};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .value {
    color: ${tokens.color.ink1};
    font-family: ${tokens.font.mono};
    font-size: 22px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
`;

const SectionLabel = styled.div`
  margin-bottom: 10px;
  color: ${tokens.color.ink2};
  font-size: 12px;
  font-weight: 600;
`;

const Hint = styled.div`
  margin-top: 12px;
  color: ${tokens.color.ink4};
  font-size: 11.5px;
  line-height: 1.5;
`;

interface EditFormProps {
  image?: OcrImageItem;
  onOrderDateChange?: (value: string) => void;
}

export const EditForm: React.FC<EditFormProps> = ({ image, onOrderDateChange }) => {
  if (!image) {
    return (
      <Card>
        <CardBd>
          <div style={{ fontSize: 13, color: tokens.color.ink4, textAlign: "center", padding: 40 }}>
            이미지를 선택하면 분석 결과가 표시됩니다.
          </div>
        </CardBd>
      </Card>
    );
  }

  return (
    <Card>
      <CardBd>
        <MetaRow>
          <Tag kind={image.platform}>{PLATFORM_LABELS[image.platform]}</Tag>
          <MetaSeparator />
          <MetaCell>
            <div className="label">주문일자</div>
            {onOrderDateChange ? (
              <DateInput
                type="text"
                value={image.orderDate}
                placeholder="YYYY.MM.DD"
                onChange={(event) => onOrderDateChange(event.target.value)}
                aria-label="주문일자"
              />
            ) : (
              <div className="value">{image.orderDate}</div>
            )}
          </MetaCell>
          <MetaSeparator />
          <MetaCell>
            <div className="label">상품 수</div>
            <div className="value">{image.productCount}개</div>
          </MetaCell>
          <MetaSeparator />
          <Tag kind={image.statusTag}>{STATUS_LABELS[image.statusTag]}</Tag>
        </MetaRow>

        <Total>
          <div className="label">전체 거래금액</div>
          <div className="value">₩{image.totalAmount.toLocaleString("ko-KR")}</div>
        </Total>

        <SectionLabel>상품 목록</SectionLabel>
        <ProductTable products={image.products} />

        <Hint>OCR 결과는 초안 상태예요. 주문일자가 오인식됐다면 위 입력에서 바로 수정할 수 있습니다.</Hint>
      </CardBd>
    </Card>
  );
};
