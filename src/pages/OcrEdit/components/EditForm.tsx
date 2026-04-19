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

export const EditForm: React.FC<{ image?: OcrImageItem }> = ({ image }) => {
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
            <div className="value">{image.orderDate}</div>
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

        <Hint>OCR 결과는 초안 상태예요. 수정 후 저장하면 거래 내역에 반영됩니다.</Hint>
      </CardBd>
    </Card>
  );
};
