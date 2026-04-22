/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 *       OCR 추출 결과를 보여주고 주문일자를 수정할 수 있도록 인풋으로 제공합니다.
 *       또한 카테고리 체크박스를 통해 분류를 지정하고, 필요하면 사용자가 직접
 *       카테고리 목록을 추가/삭제할 수 있도록 인터페이스를 제공합니다.
 * 위치: src\pages\OcrEdit\components\EditForm.tsx
 */
import React, { useState } from "react";
import styled from "styled-components";
import { Card, CardBd } from "../../../components/primitives/Card";
import { Tag } from "../../../components/primitives/Tag";
import { tokens } from "../../../styles/tokens";
import type { OcrImageItem } from "../data";
import { ProductTable } from "./ProductTable";
import { CATEGORY_LABELS, PLATFORM_LABELS, STATUS_LABELS } from "../../../constants/labels";
import { fromIsoDate, toIsoDate } from "../../../utils/date";

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

/**
 * 카테고리 체크박스 영역. ManualEntry의 CheckChip과 시각적으로 일관되게 맞추되,
 * OCR 편집 화면에서는 사용자가 목록 자체를 늘리거나 줄일 수 있어야 하므로
 * 각 칩에 삭제 버튼을 포함합니다.
 */
const CategorySection = styled.div`
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid ${tokens.color.line2};
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;

const CategoryTitle = styled.div`
  color: ${tokens.color.ink2};
  font-size: 12px;
  font-weight: 600;
`;

const CategoryHelp = styled.div`
  margin-bottom: 10px;
  color: ${tokens.color.ink4};
  font-size: 11.5px;
  line-height: 1.5;
`;

const CheckGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CheckChip = styled.label<{ $checked: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 6px 12px;
  border: 1px solid
    ${({ $checked }) => ($checked ? tokens.color.accent : tokens.color.line)};
  border-radius: ${tokens.radius.chip};
  background: ${({ $checked }) =>
    $checked ? tokens.color.accentSubtle : tokens.color.panel};
  color: ${({ $checked }) =>
    $checked ? tokens.color.accentHover : tokens.color.ink2};
  font-size: 12px;
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

const RemoveButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 16px;
  height: 16px;
  margin-left: 2px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: ${tokens.color.ink4};
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  transition:
    background ${tokens.motion.fast} ease,
    color ${tokens.motion.fast} ease;

  &:hover {
    background: ${tokens.color.line2};
    color: ${tokens.color.ink1};
  }
`;

const AddArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

const AddInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 10px;
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.control};
  background: ${tokens.color.panel};
  color: ${tokens.color.ink1};
  font-family: inherit;
  font-size: 12.5px;
  outline: none;
  transition: border-color ${tokens.motion.fast}, box-shadow ${tokens.motion.fast};

  &::placeholder {
    color: ${tokens.color.ink5};
  }

  &:focus {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }
`;

const AddButton = styled.button`
  height: 32px;
  padding: 0 12px;
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.control};
  background: ${tokens.color.panel};
  color: ${tokens.color.ink2};
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  transition: background ${tokens.motion.fast}, border-color ${tokens.motion.fast};

  &:hover:not(:disabled) {
    border-color: ${tokens.color.accent};
    color: ${tokens.color.accentHover};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const ToggleAdd = styled.button`
  border: none;
  background: none;
  color: ${tokens.color.accentHover};
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
`;

/**
 * 카테고리 한 항목. key는 내부 식별용, label은 사용자에게 보이는 이름.
 * 기본 카테고리 4개는 CATEGORY_LABELS에서 주입하고, 사용자가 추가한 항목은
 * 시간값 기반 key로 구분합니다.
 */
interface CategoryOption {
  key: string;
  label: string;
}

const DEFAULT_CATEGORIES: CategoryOption[] = Object.entries(CATEGORY_LABELS).map(
  ([key, label]) => ({ key, label })
);

interface EditFormProps {
  image?: OcrImageItem;
  onOrderDateChange?: (value: string) => void;
}

export const EditForm: React.FC<EditFormProps> = ({ image, onOrderDateChange }) => {
  /**
   * 카테고리 목록은 이미지 간에 공유되도록 상단에서 관리합니다. 사용자가 한 번
   * 추가한 카테고리는 다른 OCR 이미지 편집 시에도 그대로 선택할 수 있어야 자연스럽기 때문입니다.
   * 반면 체크 상태(어떤 카테고리로 분류했는지)는 이미지별로 다르므로 image.id를 키로 분리합니다.
   */
  const [categories, setCategories] = useState<CategoryOption[]>(DEFAULT_CATEGORIES);
  const [selectedByImage, setSelectedByImage] = useState<Record<string, string[]>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [draftLabel, setDraftLabel] = useState("");

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

  const selectedKeys = selectedByImage[image.id] ?? [];

  const toggleCategory = (key: string) => {
    setSelectedByImage((prev) => {
      const current = prev[image.id] ?? [];
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
      return { ...prev, [image.id]: next };
    });
  };

  const handleAddCategory = () => {
    const label = draftLabel.trim();
    if (!label) return;
    // 동일한 이름이 이미 있으면 중복 추가를 막고 입력만 초기화합니다.
    const exists = categories.some((category) => category.label === label);
    if (exists) {
      setDraftLabel("");
      setIsAdding(false);
      return;
    }
    const key = `custom_${Date.now()}`;
    setCategories((prev) => [...prev, { key, label }]);
    setDraftLabel("");
    setIsAdding(false);
  };

  const handleRemoveCategory = (key: string) => {
    setCategories((prev) => prev.filter((category) => category.key !== key));
    // 삭제한 카테고리가 선택 상태였다면 각 이미지의 선택 목록에서도 제거해 둡니다.
    setSelectedByImage((prev) => {
      const next: Record<string, string[]> = {};
      for (const [imageId, keys] of Object.entries(prev)) {
        next[imageId] = keys.filter((selectedKey) => selectedKey !== key);
      }
      return next;
    });
  };

  return (
    <Card>
      <CardBd>
        <MetaRow>
          <Tag kind={image.platform}>{PLATFORM_LABELS[image.platform]}</Tag>
          <MetaSeparator />
          <MetaCell>
            <div className="label">주문일자</div>
            {onOrderDateChange ? (
              /* 수동 입력과 동일하게 네이티브 달력을 쓰고, 저장 포맷은 YYYY.MM.DD로 정규화합니다. */
              <DateInput
                type="date"
                value={toIsoDate(image.orderDate)}
                onChange={(event) => onOrderDateChange(fromIsoDate(event.target.value))}
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

        <CategorySection>
          <CategoryHeader>
            <CategoryTitle>카테고리</CategoryTitle>
            {!isAdding && (
              <ToggleAdd type="button" onClick={() => setIsAdding(true)}>
                + 카테고리 추가
              </ToggleAdd>
            )}
          </CategoryHeader>
          <CategoryHelp>
            하나의 거래가 여러 카테고리에 걸칠 수 있어서 여러 개 선택할 수 있어요.
            카테고리 오른쪽 × 버튼으로 목록에서 제거할 수도 있습니다.
          </CategoryHelp>
          <CheckGroup>
            {categories.map((category) => {
              const checked = selectedKeys.includes(category.key);
              return (
                <CheckChip key={category.key} $checked={checked}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(category.key)}
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
                  {category.label}
                  <RemoveButton
                    type="button"
                    aria-label={`${category.label} 카테고리 삭제`}
                    onClick={(event) => {
                      // label 클릭 시 체크박스 토글이 함께 발동하는 걸 막습니다.
                      event.preventDefault();
                      event.stopPropagation();
                      handleRemoveCategory(category.key);
                    }}
                  >
                    ×
                  </RemoveButton>
                </CheckChip>
              );
            })}
            {categories.length === 0 && (
              <div style={{ fontSize: 12, color: tokens.color.ink4 }}>
                등록된 카테고리가 없어요. 오른쪽 위 '카테고리 추가'를 눌러 만들어 보세요.
              </div>
            )}
          </CheckGroup>

          {isAdding && (
            <AddArea>
              <AddInput
                type="text"
                placeholder="예: 취미, 반려동물, 뷰티"
                value={draftLabel}
                onChange={(event) => setDraftLabel(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddCategory();
                  } else if (event.key === "Escape") {
                    setIsAdding(false);
                    setDraftLabel("");
                  }
                }}
                autoFocus
                aria-label="새 카테고리 이름"
              />
              <AddButton
                type="button"
                onClick={handleAddCategory}
                disabled={!draftLabel.trim()}
              >
                추가
              </AddButton>
              <AddButton
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setDraftLabel("");
                }}
              >
                취소
              </AddButton>
            </AddArea>
          )}
        </CategorySection>
      </CardBd>
    </Card>
  );
};
