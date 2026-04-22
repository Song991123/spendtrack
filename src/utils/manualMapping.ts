/**
 * 역할: 수동 입력 폼(수동/수정 모두)에서 공용으로 쓰는 값 매핑 유틸.
 *       사용자가 입력한 자유 텍스트/체크박스 값을 TxRow가 요구하는
 *       TxPlatform / TxCategory[] enum 형태로 수렴시킵니다.
 * 위치: src\utils\manualMapping.ts
 */
import type {
  TxCategory,
  TxPlatform,
} from "../pages/Transactions/components/TransactionTable";
import { MAX_CATEGORIES_PER_TX } from "../constants/labels";

/**
 * 입력한 플랫폼 텍스트를 TxRow 타입에 맞는 키로 매핑합니다.
 * 사용자가 "쿠팡 위클리"처럼 변형을 쓸 수 있어서 contains 기반으로 매칭합니다.
 * 어느 키도 매칭되지 않으면 집계가 망가지지 않도록 알려진 플랫폼(coupang)으로 수렴.
 */
export function mapPlatform(input: string): TxPlatform {
  const normalized = input.replace(/\s/g, "");
  if (normalized.includes("쿠팡") || normalized.toLowerCase().includes("coupang")) {
    return "coupang";
  }
  if (normalized.includes("네이버") || normalized.toLowerCase().includes("naver")) {
    return "naver";
  }
  if (normalized.includes("무신사") || normalized.toLowerCase().includes("musinsa")) {
    return "musinsa";
  }
  return "etc";
}

/**
 * 체크박스로 선택한 카테고리 키 배열을 TxRow.categories 배열로 매핑합니다.
 * - 표준 카테고리(living/fashion/digital/food/etc)만 저장 대상.
 * - 아무 것도 해당하지 않으면 ["etc"]로 수렴시킵니다(빈 배열 금지).
 * - 상한은 MAX_CATEGORIES_PER_TX로 잘라냅니다.
 */
export function mapCategories(keys: string[]): TxCategory[] {
  const STANDARD: TxCategory[] = ["living", "fashion", "digital", "food", "etc"];
  const standardSet = new Set<string>(STANDARD);
  const picked: TxCategory[] = [];
  for (const key of keys) {
    if (!standardSet.has(key)) continue;
    if (picked.includes(key as TxCategory)) continue;
    picked.push(key as TxCategory);
    if (picked.length >= MAX_CATEGORIES_PER_TX) break;
  }
  if (picked.length === 0) return ["etc"];
  return picked;
}
