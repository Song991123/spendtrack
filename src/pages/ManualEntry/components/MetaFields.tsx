/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\ManualEntry\components\MetaFields.tsx
 */
import React from "react";
import styled from "styled-components";
import { FormField } from "../../../components/form/FormField";
import { TextInput } from "../../../components/form/TextInput";
import { CATEGORY_LABELS } from "../../../constants/labels";
import { tokens } from "../../../styles/tokens";
import { media } from "../../../tokens/breakpoints";

export type CategoryKey = keyof typeof CATEGORY_LABELS;

// "기타"를 맨 뒤에 두어, 사용자가 특정 카테고리를 고르지 못했을 때 마지막 선택지로 눈에 띄게 합니다.
const CATEGORY_OPTIONS: CategoryKey[] = ["living", "fashion", "digital", "food", "etc"];

/**
 * 수동 입력 폼의 메타 필드들. 상위 ManualEntry 페이지가 저장 버튼을 눌렀을 때
 * 이 필드 값을 모두 collect 해서 transactionsStore에 addOne() 할 수 있도록
 * 컨트롤드 입력으로 만들었습니다. props가 없으면 undefined 기본값으로 동작합니다.
 */
export interface MetaFieldValues {
  title: string;
  amount: string;
  platform: string;
  date: string;
  categories: CategoryKey[];
  memo: string;
}

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

const CheckGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

/**
 * 하나의 거래가 여러 카테고리에 걸칠 수 있어서 셀렉트 대신 체크박스 칩으로 다중 선택을 받습니다.
 * 네이티브 체크박스를 숨기고 label 자체에 선택 상태 스타일을 입혀 '토글 가능한 칩' 느낌을 냅니다.
 */
const CheckChip = styled.label<{ $checked: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border: 1px solid
    ${({ $checked }) => ($checked ? tokens.color.accent : tokens.color.line)};
  border-radius: ${tokens.radius.chip};
  background: ${({ $checked }) =>
    $checked ? tokens.color.accentSubtle : tokens.color.panel};
  color: ${({ $checked }) =>
    $checked ? tokens.color.accentHover : tokens.color.ink2};
  font-size: ${tokens.type.caption.size};
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition:
    background ${tokens.motion.fast} ease,
    border-color ${tokens.motion.fast} ease,
    color ${tokens.motion.fast} ease;

  &:hover {
    border-color: ${tokens.color.accent};
  }

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
  }

  .mark {
    display: grid;
    place-items: center;
    width: 14px;
    height: 14px;
    border-radius: 4px;
    background: ${({ $checked }) =>
      $checked ? tokens.color.accent : "transparent"};
    border: 1.5px solid
      ${({ $checked }) => ($checked ? tokens.color.accent : tokens.color.ink5)};
    color: #fff;
    transition:
      background ${tokens.motion.fast} ease,
      border-color ${tokens.motion.fast} ease;
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

export const MetaFields: React.FC<{
  value: MetaFieldValues;
  onChange: (next: MetaFieldValues) => void;
}> = ({ value, onChange }) => {
  const patch = (partial: Partial<MetaFieldValues>) =>
    onChange({ ...value, ...partial });

  const toggle = (key: CategoryKey) => {
    patch({
      categories: value.categories.includes(key)
        ? value.categories.filter((k) => k !== key)
        : [...value.categories, key],
    });
  };

  return (
    <Grid>
      <Field>
        <FormField label="거래명">
          <TextInput
            placeholder="예: 쿠팡 주문, 네이버 환불"
            value={value.title}
            onChange={(event) => patch({ title: event.target.value })}
          />
        </FormField>
      </Field>
      <Field>
        <FormField label="금액">
          <TextInput
            placeholder="예: 129000"
            value={value.amount}
            onChange={(event) => patch({ amount: event.target.value })}
          />
        </FormField>
      </Field>
      <Field>
        <FormField label="플랫폼">
          <TextInput
            placeholder="쿠팡, 네이버쇼핑, 무신사"
            value={value.platform}
            onChange={(event) => patch({ platform: event.target.value })}
          />
        </FormField>
      </Field>
      <Field>
        <FormField label="거래일자">
          <TextInput
            placeholder="YYYY.MM.DD"
            value={value.date}
            onChange={(event) => patch({ date: event.target.value })}
          />
        </FormField>
      </Field>
      <Field $span={2}>
        <FormField
          label="카테고리"
          helpText="하나의 거래가 여러 카테고리에 걸칠 수 있어서 여러 개 선택할 수 있어요."
        >
          <CheckGroup>
            {CATEGORY_OPTIONS.map((key) => {
              const checked = value.categories.includes(key);
              return (
                <CheckChip key={key} $checked={checked}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(key)}
                  />
                  <span className="mark" aria-hidden="true">
                    {checked && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 8.5 6.5 12 13 4.5" />
                      </svg>
                    )}
                  </span>
                  {CATEGORY_LABELS[key]}
                </CheckChip>
              );
            })}
          </CheckGroup>
        </FormField>
      </Field>
      <Field $span={2}>
        <FormField label="메모" helpText="선택 항목">
          <Textarea
            placeholder="거래에 대한 메모를 남겨보세요."
            value={value.memo}
            onChange={(event) => patch({ memo: event.target.value })}
          />
        </FormField>
      </Field>
    </Grid>
  );
};
