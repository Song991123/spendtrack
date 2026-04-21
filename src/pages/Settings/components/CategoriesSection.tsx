/**
 * 역할: 설정 화면의 카테고리 관리 블록.
 *       - "기타"는 모든 미지정 거래의 폴백이라 삭제할 수 없게 잠가둡니다.
 *       - 그 외 카테고리는 언제든 삭제할 수 있고, 사용자가 원하는 이름/색으로 추가할 수도 있습니다.
 *       - 각 행의 건수는 transactionsStore를 구독해 실제 거래 수를 반영합니다.
 *         사용자 정의 카테고리는 아직 거래와 연결되지 않으므로 0건으로 표시됩니다.
 * 위치: src\pages\Settings\components\CategoriesSection.tsx
 */
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";
import { SettingsBlock } from "./SettingsSection";
import { Button } from "../../../components/primitives/Button";
import { CATEGORY_LABELS, DEFAULT_CATEGORY_KEY } from "../../../constants/labels";
import { useTransactionsStore } from "../../../stores/transactionsStore";
import type { TxCategory } from "../../../pages/Transactions/components/TransactionTable";
import { CategoryAddModal, type CategoryAddPayload } from "./CategoryAddModal";

/**
 * 한 카테고리 엔트리. 표준 5종(living/fashion/digital/food/etc)은 id를 TxCategory 키로 두고,
 * 사용자가 직접 만든 카테고리는 `custom_...` 접두사로 구분합니다.
 * isLocked는 "기타"만 true입니다 — 삭제 버튼 자체를 숨기고 행을 한 톤 흐리게 렌더합니다.
 * isStandard는 TxCategory enum에 속한 항목으로, 실제 거래 건수를 계산할 수 있습니다.
 */
interface CategoryEntry {
  id: string;
  name: string;
  color: string;
  isStandard: boolean;
  isLocked: boolean;
}

/**
 * 초기 카테고리 집합. CATEGORY_LABELS의 5종을 기본 색상과 함께 등록합니다.
 * "기타"는 잠금 플래그를 달아 삭제되지 않게 합니다.
 */
const INITIAL_CATEGORIES: CategoryEntry[] = [
  {
    id: DEFAULT_CATEGORY_KEY,
    name: CATEGORY_LABELS.etc,
    color: tokens.color.cat5,
    isStandard: true,
    // 기타는 미지정 거래가 수렴되는 폴백이라 목록에서 없앨 수 없습니다. 목록의 첫 줄에 고정해
    // "기본값"이라는 정체성을 시각적으로도 강조합니다.
    isLocked: true,
  },
  { id: "living", name: CATEGORY_LABELS.living, color: tokens.color.cat2, isStandard: true, isLocked: false },
  { id: "fashion", name: CATEGORY_LABELS.fashion, color: tokens.color.cat1, isStandard: true, isLocked: false },
  { id: "digital", name: CATEGORY_LABELS.digital, color: tokens.color.cat4, isStandard: true, isLocked: false },
  { id: "food", name: CATEGORY_LABELS.food, color: tokens.color.cat3, isStandard: true, isLocked: false },
];

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
`;

const HeaderNote = styled.span`
  color: ${tokens.color.ink4};
  font-size: 12px;
`;

const List = styled.div`
  display: grid;
`;

/**
 * 한 줄짜리 카테고리 행. 잠긴(isLocked) 행은 배경과 텍스트를 한 톤 내려서
 * "이 줄은 고정 항목"이라는 점을 한눈에 알 수 있게 합니다.
 */
const Row = styled.div<{ $locked?: boolean }>`
  display: grid;
  grid-template-columns: 16px 1fr auto auto;
  gap: 14px;
  align-items: center;
  padding: 12px 12px;
  border-bottom: 1px solid ${tokens.color.line2};
  background: ${({ $locked }) => ($locked ? tokens.color.foot : "transparent")};
  color: ${({ $locked }) => ($locked ? tokens.color.ink4 : "inherit")};
  border-radius: ${({ $locked }) => ($locked ? tokens.radius.control : "0")};
  margin: ${({ $locked }) => ($locked ? "0 -12px" : "0")};

  &:last-of-type {
    border-bottom: none;
  }
`;

const Dot = styled.span<{ $color: string; $muted?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
  opacity: ${({ $muted }) => ($muted ? 0.7 : 1)};
`;

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const Name = styled.span`
  color: ${tokens.color.ink1};
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LockBadge = styled.span`
  padding: 2px 8px;
  border-radius: ${tokens.radius.chip};
  background: ${tokens.color.tint};
  color: ${tokens.color.ink4};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const Count = styled.span`
  color: ${tokens.color.ink4};
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
`;

/**
 * 각 행의 "삭제" 버튼. 잠긴(isLocked) 항목에서는 이 버튼을 아예 렌더하지 않고
 * 행 전체를 한 톤 흐린 배경으로 깔아 편집 불가 상태를 시각화합니다.
 */
const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 10px;
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.control};
  background: ${tokens.color.panel};
  color: ${tokens.color.ink3};
  cursor: pointer;
  font-family: inherit;
  font-size: 11.5px;
  font-weight: 600;
  transition:
    background ${tokens.motion.fast} ease,
    border-color ${tokens.motion.fast} ease,
    color ${tokens.motion.fast} ease;

  &:hover:not(:disabled) {
    background: ${tokens.color.negBg};
    border-color: ${tokens.color.negBorder};
    color: ${tokens.color.neg};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * 표준 카테고리 키인지 판별합니다. custom_ 접두사가 붙지 않은 값은 표준 키로 간주합니다.
 */
function isTxCategoryKey(id: string): id is TxCategory {
  return id === "living" || id === "fashion" || id === "digital" || id === "food" || id === "etc";
}

export const CategoriesSection: React.FC = () => {
  const rows = useTransactionsStore();
  const [categories, setCategories] = useState<CategoryEntry[]>(INITIAL_CATEGORIES);
  const [isAddOpen, setIsAddOpen] = useState(false);

  /**
   * 표준 카테고리별 거래 건수 집계. 사용자 정의 카테고리는 아직 TxCategory union에 들어가지 않으므로
   * 0건으로 표시됩니다(데모 범위).
   */
  const countByCategory = useMemo(() => {
    const counter: Record<TxCategory, number> = {
      living: 0,
      fashion: 0,
      digital: 0,
      food: 0,
      etc: 0,
    };
    for (const row of rows) {
      counter[row.category] += 1;
    }
    return counter;
  }, [rows]);

  const handleAdd = (payload: CategoryAddPayload) => {
    const id = `custom_${Date.now()}`;
    setCategories((prev) => [
      ...prev,
      { id, name: payload.name, color: payload.color, isStandard: false, isLocked: false },
    ]);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((category) => !(category.id === id && !category.isLocked)));
  };

  const existingNames = categories.map((category) => category.name);

  return (
    <>
      <SettingsBlock
        title="카테고리"
        subtitle="지출과 수입을 구분하는 카테고리 목록이에요. 색상은 리포트와 차트에 반영돼요. ‘기타’는 카테고리를 지정하지 않은 거래의 기본값이라 삭제할 수 없어요."
      >
        <HeaderBar>
          <HeaderNote>총 {categories.length}개 · 기타 제외 삭제 가능</HeaderNote>
          <Button variant="secondary" size="sm" onClick={() => setIsAddOpen(true)}>
            + 카테고리 추가
          </Button>
        </HeaderBar>
        <List>
          {categories.map((category) => {
            const count = category.isStandard && isTxCategoryKey(category.id)
              ? countByCategory[category.id]
              : 0;
            return (
              <Row
                key={category.id}
                $locked={category.isLocked}
                aria-disabled={category.isLocked || undefined}
                title={category.isLocked ? "기타는 미지정 거래의 기본값이라 편집할 수 없어요" : undefined}
              >
                <Dot $color={category.color} $muted={category.isLocked} />
                <NameCell>
                  <Name>{category.name}</Name>
                  {category.isLocked && <LockBadge>기본</LockBadge>}
                </NameCell>
                <Count>{count}건</Count>
                {/* 잠긴 행은 삭제 버튼을 렌더하지 않고 자리만 빈 칸으로 남겨 그리드를 정렬합니다. */}
                {category.isLocked ? (
                  <span aria-hidden="true" />
                ) : (
                  <DeleteButton
                    type="button"
                    aria-label={`${category.name} 카테고리 삭제`}
                    title="삭제"
                    onClick={() => handleDelete(category.id)}
                  >
                    삭제
                  </DeleteButton>
                )}
              </Row>
            );
          })}
        </List>
      </SettingsBlock>
      <CategoryAddModal
        isOpen={isAddOpen}
        existingNames={existingNames}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
      />
    </>
  );
};
