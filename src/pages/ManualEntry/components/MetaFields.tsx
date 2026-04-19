/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\ManualEntry\components\MetaFields.tsx
 */
import React from "react";
import styled from "styled-components";
import { FormField } from "../../../components/form/FormField";
import { TextInput } from "../../../components/form/TextInput";
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
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 64px;
  padding: 9px 12px;
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.control};
  background: ${tokens.color.panel};
  color: ${tokens.color.ink1};
  font-family: inherit;
  font-size: ${tokens.type.bodySm.size};
  outline: none;
  resize: vertical;
  transition: border-color ${tokens.motion.fast}, box-shadow ${tokens.motion.fast};

  &:focus {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }

  &::placeholder {
    color: ${tokens.color.ink5};
  }
`;

export const MetaFields: React.FC = () => (
  <Grid>
    <Field>
      <FormField label="거래명">
        <TextInput placeholder="예: 쿠팡 주문, 네이버 환불" />
      </FormField>
    </Field>
    <Field>
      <FormField label="금액">
        <TextInput placeholder="예: 129000" />
      </FormField>
    </Field>
    <Field>
      <FormField label="플랫폼">
        <TextInput placeholder="쿠팡, 네이버쇼핑, 무신사" />
      </FormField>
    </Field>
    <Field>
      <FormField label="거래일자">
        <TextInput placeholder="YYYY.MM.DD" />
      </FormField>
    </Field>
    <Field $span={2}>
      <FormField label="메모" helpText="선택 항목">
        <Textarea placeholder="거래에 대한 메모를 남겨보세요." />
      </FormField>
    </Field>
  </Grid>
);

