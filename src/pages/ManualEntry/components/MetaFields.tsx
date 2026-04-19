import React from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
  margin-bottom: 16px;

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div<{ $span?: number }>`
  grid-column: span ${({ $span }) => $span ?? 1};

  ${media.mobile} {
    grid-column: span 1;
  }

  label {
    display: block;
    margin-bottom: 6px;
    color: ${tokens.color.ink2};
    font-size: 12px;
    font-weight: 600;
  }

  input,
  textarea {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid ${tokens.color.line};
    border-radius: 8px;
    background: ${tokens.color.panel};
    color: ${tokens.color.ink1};
    font-family: inherit;
    font-size: 13.5px;
    outline: none;
    transition: border-color 0.12s, box-shadow 0.12s;
  }

  input:focus,
  textarea:focus {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }

  input::placeholder,
  textarea::placeholder {
    color: ${tokens.color.ink5};
  }

  textarea {
    min-height: 64px;
    resize: vertical;
  }
`;

export const MetaFields: React.FC = () => (
  <Grid>
    <Field>
      <label>거래명</label>
      <input placeholder="예: 쿠팡 주문, 네이버 환불" />
    </Field>
    <Field>
      <label>금액</label>
      <input placeholder="₩ 0" />
    </Field>
    <Field>
      <label>플랫폼</label>
      <input placeholder="쿠팡, 네이버쇼핑, 무신사..." />
    </Field>
    <Field>
      <label>거래일자</label>
      <input placeholder="YYYY.MM.DD" />
    </Field>
    <Field $span={2}>
      <label>메모 (선택)</label>
      <textarea placeholder="거래에 대한 메모를 남겨보세요" />
    </Field>
  </Grid>
);
