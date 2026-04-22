/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 *       OCR 추출 결과를 보여주고 주문일자/상태 태그를 수정할 수 있도록 인풋으로 제공합니다.
 *       한 캡쳐(OcrImageItem)에 여러 주문(OcrOrder)이 들어 있을 수 있으므로
 *       "상단 플랫폼 태그 → 주문 블록 N개 → 하단 카테고리" 순으로 스택을 쌓습니다.
 *       각 주문 블록은 자신의 주문일자/전체금액/상품 목록/상태 태그를 독립적으로
 *       표시/편집해서, 저장 시 한 주문 = 한 TxRow가 되도록 시각적으로도 분리된 느낌을 줍니다.
 * 위치: src\pages\OcrEdit\components\EditForm.tsx
 */
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Card, CardBd } from "../../../components/primitives/Card";
import { DatePicker } from "../../../components/primitives/DatePicker";
import { Tag } from "../../../components/primitives/Tag";
import { tokens } from "../../../styles/tokens";
import type { OcrImageItem, OcrOrder, Status } from "../data";
import { ProductTable } from "./ProductTable";
import { CATEGORY_LABELS, PLATFORM_LABELS, STATUS_LABELS } from "../../../constants/labels";

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

/**
 * 한 캡쳐 안의 주문 블록 하나를 감싸는 래퍼.
 * 카드 내부에 살짝 들여 쓴 패널을 두어 "여기서부터 여기까지가 하나의 주문"이
 * 명확히 구분되게 합니다. 여러 주문이 있을 때는 블록 사이 세로 간격으로
 * 시각적으로 떨어지게 보여 줍니다.
 */
const OrderBlock = styled.section`
  padding: 14px 14px 16px;
  border: 1px solid ${tokens.color.line2};
  border-radius: ${tokens.radius.card};
  background: ${tokens.color.panel};

  & + & {
    margin-top: 12px;
  }
`;

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

/**
 * 메타 행은 주문일자·상품수·상태 태그를 좁은 가로 바에 병렬로 배치하므로
 * DatePicker 트리거 기본 너비(100%)로 두면 행이 밀립니다. 여기서는 140px로
 * 고정해 원래의 DateInput과 같은 슬롯 크기를 유지합니다.
 */
const DatePickerSlot = styled.div`
  margin-top: 2px;
  width: 140px;
`;

const MetaSeparator = styled.span`
  width: 1px;
  height: 24px;
  background: ${tokens.color.line2};
`;

/**
 * statusTag을 클릭으로 편집할 수 있게 감싸는 래퍼.
 *
 * 디자인 요구사항: 기존 Tag의 외형(크기·색·라운드)을 그대로 보여주되,
 * "클릭해서 바꿀 수 있다"는 사실만 전달되어야 합니다.
 *  - resting 상태: Tag 그대로, 테두리/배경 추가 없음
 *  - hover 상태: accent 색의 옅은 외곽 링을 살짝 띄워 상호작용 힌트
 *  - open 상태: 조금 더 진한 링으로 "지금 편집 중"을 표시
 * 이렇게 해서 OCR 초안을 훑다가 태그가 틀렸을 때 바로 탭 한 번으로
 * 보정할 수 있게 합니다. (팀 논의 결론: 자동 인식 + 사용자 확정 하이브리드)
 */
const StatusTagWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const StatusTagTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: ${tokens.radius.tag};
  background: transparent;
  cursor: pointer;
  line-height: 0;
  transition: box-shadow ${tokens.motion.fast} ease;

  &:hover {
    box-shadow: 0 0 0 2px ${tokens.color.accentSubtle};
  }

  &[aria-expanded="true"] {
    box-shadow: 0 0 0 2px ${tokens.color.accent};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${tokens.shadow.focus};
  }
`;

const StatusPopover = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  min-width: 116px;
  padding: 4px;
  background: ${tokens.color.panel};
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.control};
  box-shadow: ${tokens.shadow.cardHover};
`;

const StatusOptionButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 10px;
  border: none;
  border-radius: ${tokens.radius.tag};
  background: ${({ $active }) =>
    $active ? tokens.color.accentSubtle : "transparent"};
  color: ${({ $active }) =>
    $active ? tokens.color.accentHover : tokens.color.ink2};
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: background ${tokens.motion.fast} ease;

  &:hover {
    background: ${tokens.color.tint};
  }
`;

/**
 * OCR 편집 화면에서 사용자에게 노출할 상태 선택지.
 * - 쇼핑 플랫폼 OCR 맥락에서 구매/정기결제/취소/환불이면 대부분의 케이스가 커버됩니다.
 * - 같은 캡쳐에 여러 상태가 섞여 있더라도, 주문 단위 편집이 가능하도록 이 값은 주문별로 관리됩니다.
 */
const STATUS_EDIT_OPTIONS: Status[] = ["purchase", "sub", "cancel", "refund"];

interface EditableStatusTagProps {
  value: Status;
  onChange: (next: Status) => void;
}

const EditableStatusTag: React.FC<EditableStatusTagProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // 팝오버 바깥을 클릭하거나 Esc를 눌렀을 때 닫히도록 document 레벨 리스너를 연결합니다.
    // open일 때만 리스너를 걸어 불필요한 이벤트 구독을 피합니다.
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <StatusTagWrapper ref={wrapperRef}>
      <StatusTagTrigger
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`거래유형 ${STATUS_LABELS[value]} · 클릭해서 변경`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Tag kind={value}>{STATUS_LABELS[value]}</Tag>
      </StatusTagTrigger>
      {open && (
        <StatusPopover role="listbox">
          {STATUS_EDIT_OPTIONS.map((option) => (
            <StatusOptionButton
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              $active={option === value}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              <span>{STATUS_LABELS[option]}</span>
              {option === value && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 8.5 6.5 12 13 4.5" />
                </svg>
              )}
            </StatusOptionButton>
          ))}
        </StatusPopover>
      )}
    </StatusTagWrapper>
  );
};

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
    font-size: 20px;
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
  /**
   * 주문 블록 내부 필드를 수정했을 때 상위(OcrEditPage)로 patch를 올립니다.
   * onOrderDateChange/onStatusTagChange를 분리하지 않고 patch로 합친 이유는
   * 주문이 N개로 늘어나면 핸들러도 N배로 늘어나 관리 비용이 커지기 때문입니다.
   */
  onOrderPatch?: (orderId: string, patch: Partial<Pick<OcrOrder, "orderDate" | "statusTag">>) => void;
}

export const EditForm: React.FC<EditFormProps> = ({ image, onOrderPatch }) => {
  /**
   * 카테고리 목록은 이미지 간에 공유되도록 상단에서 관리합니다. 사용자가 한 번
   * 추가한 카테고리는 다른 OCR 이미지 편집 시에도 그대로 선택할 수 있어야 자연스럽기 때문입니다.
   * 반면 체크 상태(어떤 카테고리로 분류했는지)는 이미지별로 다르므로 image.id를 키로 분리합니다.
   * 한 이미지에 주문이 여러 개여도, 카테고리는 이미지 단위로 공유해서 "이 쇼핑몰 결제의 묶음"
   * 단위로 성격 태그를 달 수 있게 합니다. (주문 단위 카테고리가 필요한 경우는 저장 후
   * 거래내역 페이지에서 개별 편집으로 커버)
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
        {/* 이미지 전체 메타는 상단 한 줄에만 표시합니다. 플랫폼 태그는 이미지 단위이며
         * 같은 캡쳐 안의 주문이 여러 개여도 공통이라 여기서 한 번만 보여 줍니다. */}
        <HeaderRow>
          <Tag kind={image.platform}>{PLATFORM_LABELS[image.platform]}</Tag>
          <div style={{ color: tokens.color.ink4, fontSize: 11.5 }}>
            주문 {image.orders.length}건
          </div>
        </HeaderRow>

        {image.orders.map((order) => (
          <OrderBlock key={order.id}>
            <MetaRow>
              <MetaCell>
                <div className="label">주문일자</div>
                {onOrderPatch ? (
                  /* 수동 입력과 동일한 공용 DatePicker를 써서 앱 전체의 달력 UX를 통일합니다.
                     내부에서 YYYY.MM.DD ↔ YYYY-MM-DD 변환을 처리하므로 호출부는 저장 포맷을 그대로 주고받습니다. */
                  <DatePickerSlot>
                    <DatePicker
                      value={order.orderDate}
                      onChange={(value) => onOrderPatch(order.id, { orderDate: value })}
                      size="sm"
                      aria-label="주문일자"
                    />
                  </DatePickerSlot>
                ) : (
                  <div className="value">{order.orderDate}</div>
                )}
              </MetaCell>
              <MetaSeparator />
              <MetaCell>
                <div className="label">상품 수</div>
                <div className="value">{order.products.length}개</div>
              </MetaCell>
              <MetaSeparator />
              {/* statusTag은 OCR이 자동 추정한 값이라 오인식될 수 있어, Tag를 그대로 두되
               * 클릭하면 팝오버에서 바로 바꿀 수 있게 합니다. 디자인은 변경하지 않고
               * 호버 시 옅은 링만 띄워 "편집 가능"을 알립니다. */}
              {onOrderPatch ? (
                <EditableStatusTag
                  value={order.statusTag}
                  onChange={(next) => onOrderPatch(order.id, { statusTag: next })}
                />
              ) : (
                <Tag kind={order.statusTag}>{STATUS_LABELS[order.statusTag]}</Tag>
              )}
              {/* 쇼핑몰이 실제로 찍어 준 원문 라벨(예: "배송완료 · 4/9(목) 도착")은
               * statusTag 옆에 작게 노출해서 "우리 내부 분류"와 "쇼핑몰 원문"이
               * 어떻게 대응되는지 사용자가 확인할 수 있게 합니다. */}
              {order.statusLabel && (
                <MetaCell>
                  <div className="label">원문 라벨</div>
                  <div className="value" style={{ color: tokens.color.ink4, fontSize: 11.5 }}>
                    {order.statusLabel}
                  </div>
                </MetaCell>
              )}
            </MetaRow>

            <Total>
              <div className="label">주문 금액</div>
              <div className="value">₩{order.totalAmount.toLocaleString("ko-KR")}</div>
            </Total>

            <SectionLabel>상품 목록</SectionLabel>
            <ProductTable products={order.products} />
          </OrderBlock>
        ))}

        <Hint>
          OCR 결과는 초안 상태예요. 같은 캡쳐에 구매/환불이 섞여 있어도 주문 단위로
          분리해 저장하니, 각 블록의 주문일자·상태 태그를 필요한 만큼 조정해 주세요.
        </Hint>

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
            이 캡쳐에서 만들어질 거래 전체에 공통으로 붙일 카테고리예요. 하나의 거래가
            여러 카테고리에 걸칠 수 있어서 여러 개 선택할 수 있고, 오른쪽 × 버튼으로
            목록에서 제거할 수도 있습니다.
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
