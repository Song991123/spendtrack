/**
 * 역할: 해당 화면의 상태와 레이아웃을 조립하는 페이지 진입 파일입니다.
 * 위치: src\pages\ManualEntry\index.tsx
 */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { Card, CardBd } from "../../components/primitives/Card";
import { Button } from "../../components/primitives/Button";
import {
  ProductAddModal,
  type ProductAddPayload,
} from "../../components/modal/ProductAddModal";
import { tokens } from "../../styles/tokens";
import { TypeSegment, type TxType } from "./components/TypeSegment";
import { MetaFields, type MetaFieldValues } from "./components/MetaFields";
import { StatusTags, type StatusKey } from "./components/StatusTags";
import {
  defaultStatusForType,
  isValidStatusForType,
} from "./components/statusOptions";
import { ProductRows, type ManualProduct } from "./components/ProductRows";
import { transactionsStore, useTransactionsStore } from "../../stores/transactionsStore";
import { checkDuplicates, autoResolveDuplicates, type MergeAction } from "../../utils/duplicateCheck";
import { SaveResultModal } from "../../components/modal/SaveResultModal";
import { ConflictResolveModal } from "../../components/modal/ConflictResolveModal";
import {
  ProductTotalWarningModal,
  type ProductTotalWarningEntry,
} from "../../components/modal/ProductTotalWarningModal";
import { combinePatches, planEnrichment, type EnrichmentPlan } from "../../utils/mergeEnrichment";
import { checkProductTotal } from "../../utils/productTotalCheck";
import { formatKRW } from "../../utils/format";
import type { TxRow } from "./../Transactions/components/TransactionTable";
import { mapCategories, mapPlatform } from "../../utils/manualMapping";

const Lead = styled.p`
  margin: 0 0 16px;
  color: ${tokens.color.ink3};
  font-size: 13px;
`;

const SectionLabel = styled.div`
  margin-bottom: 8px;
  color: ${tokens.color.ink2};
  font-size: 12px;
  font-weight: 600;
`;

const SectionHint = styled.div`
  margin-bottom: 10px;
  color: ${tokens.color.ink4};
  font-size: 11.5px;
`;

const Foot = styled.div`
  margin-top: 16px;
  color: ${tokens.color.ink4};
  font-size: 11.5px;
`;

const SaveBar = styled.div`
  margin-top: 16px;
`;

const ErrorLine = styled.div`
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px solid ${tokens.color.neg};
  border-radius: ${tokens.radius.control};
  background: ${tokens.color.negBg};
  color: ${tokens.color.neg};
  font-size: 12px;
  font-weight: 500;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const AddButton = styled.button`
  border: none;
  background: none;
  color: ${tokens.color.accentHover};
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
`;

/**
 * 날짜·금액이 같은 기존 거래를 발견했을 때 보여주는 제안 카드.
 * MetaFields 바로 아래에 슬라이드인으로 표시되며, 사용자가 응답하기 전까지 유지됩니다.
 */
const SuggestionCard = styled.div`
  margin-bottom: 16px;
  padding: 12px 14px;
  border: 1px solid ${tokens.color.warn};
  border-radius: ${tokens.radius.card};
  background: ${tokens.color.warnBg ?? "#fffbf0"};
`;

const SuggestionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 12.5px;
  font-weight: 700;
  color: ${tokens.color.warn};
`;

const SuggestionSub = styled.div`
  margin-bottom: 10px;
  font-size: 12px;
  color: ${tokens.color.ink3};
`;

const SuggestionList = styled.ul`
  margin: 0 0 12px;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SuggestionItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  background: ${tokens.color.panel};
  border: 1px solid ${tokens.color.line2};
  font-size: 12.5px;
`;

const SuggestionItemInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SuggestionItemTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${tokens.color.ink1};
  font-weight: 500;
`;

const SuggestionItemMeta = styled.span`
  color: ${tokens.color.ink4};
  font-size: 11.5px;
  font-family: ${tokens.font.mono};
  font-variant-numeric: tabular-nums;
`;

/**
 * "이 거래와 합치기" 버튼. 제안 항목마다 하나씩 붙습니다.
 * 여러 후보가 떠도 사용자가 정확히 어느 기존 거래와 합칠지 고를 수 있게
 * 카드 전체가 아니라 각 후보 옆에 직접 배치합니다.
 */
const MergeBtn = styled.button`
  flex-shrink: 0;
  padding: 6px 10px;
  border-radius: ${tokens.radius.control};
  border: 1px solid ${tokens.color.accent};
  background: ${tokens.color.accentSubtle};
  color: ${tokens.color.accentHover};
  font-family: inherit;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity ${tokens.motion.fast};

  &:hover {
    opacity: 0.85;
  }
`;

const SuggestionActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const SuggestionBtn = styled.button<{ $primary?: boolean }>`
  padding: 6px 14px;
  border-radius: ${tokens.radius.control};
  border: 1px solid ${({ $primary }) => $primary ? tokens.color.warn : tokens.color.line};
  background: ${({ $primary }) => $primary ? tokens.color.warn : tokens.color.panel};
  color: ${({ $primary }) => $primary ? "#fff" : tokens.color.ink2};
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity ${tokens.motion.fast};

  &:hover {
    opacity: 0.85;
  }
`;

/** "맞아요" 이후 표시되는 확정 배너 */
const DupConfirmedBanner = styled.div`
  margin-bottom: 16px;
  padding: 12px 14px;
  border: 1px solid ${tokens.color.line};
  border-radius: ${tokens.radius.card};
  background: ${tokens.color.tint};
  font-size: 12.5px;
  color: ${tokens.color.ink3};
  line-height: 1.55;

  strong {
    color: ${tokens.color.ink1};
    font-weight: 700;
  }
`;

/**
 * 모달은 '추가'와 '수정' 두 모드로 동작합니다. editingId가 설정되면 수정 모드,
 * null이면 추가 모드입니다. 이렇게 한 모달로 두 흐름을 공유해 UI 일관성을 유지합니다.
 */
type ModalMode = { type: "add" } | { type: "edit"; id: string };

const EMPTY_META: MetaFieldValues = {
  title: "",
  amount: "",
  // 플랫폼은 선택사항이므로 드롭다운의 "미지정" 옵션을 기본값으로 둡니다.
  // 사용자가 아무것도 건드리지 않고 저장하면 TxPlatform="unspecified"로 기록됩니다.
  platform: "unspecified",
  date: "",
  // 사용자가 카테고리를 명시적으로 선택하기 전까지는 "기타"가 디폴트로 체크돼 있습니다.
  // 사용자가 다른 카테고리를 고르면 그대로 덮어 써집니다.
  categories: ["etc"],
  memo: "",
};

type RequiredMetaField = "title" | "amount" | "date";

export const ManualEntryPage: React.FC = () => {
  // 수동 입력 화면은 거래 유형, 상태, 메타 필드, 상품 목록을 한 페이지에서 조정합니다.
  const navigate = useNavigate();
  const allRows = useTransactionsStore();
  const [type, setType] = useState<TxType>("expense");
  const [status, setStatus] = useState<StatusKey | null>("purchase");
  const [meta, setMeta] = useState<MetaFieldValues>(EMPTY_META);
  const [products, setProducts] = useState<ManualProduct[]>([]);
  const [modal, setModal] = useState<ModalMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const focusMetaField = (field: RequiredMetaField) => {
    const target = document.getElementById(`manual-${field}`);
    if (target instanceof HTMLElement) {
      target.focus();
    }
  };

  /**
   * 날짜·금액이 같은 기존 거래를 실시간으로 조회합니다.
   * 둘 다 채워진 순간부터 비교해 후보를 표시합니다.
   */
  const candidateMatches = useMemo(() => {
    const amountNum = Number(meta.amount.replace(/[^0-9]/g, ""));
    if (!meta.date || !amountNum) return [];
    const selectedPlatform = mapPlatform(meta.platform);
    return allRows
      .filter((row) => {
        if (row.date !== meta.date) return false;
        if (Math.abs(row.amount) !== amountNum) return false;
        if (selectedPlatform === "unspecified") return true;
        return row.platform === selectedPlatform;
      })
      .slice(0, 3); // 최대 3건만 표시
  }, [meta.date, meta.amount, meta.platform, allRows]);

  /**
   * 사용자가 제안을 "맞아요"로 확정했는지 여부.
   * true면 저장 버튼을 비활성화하고 안내 배너를 표시합니다.
   */
  const [dupConfirmed, setDupConfirmed] = useState(false);
  /**
   * 사용자가 "아니에요"로 제안을 기각했는지 여부.
   * 날짜·금액이 바뀌면 자동으로 초기화됩니다.
   */
  const [dupDismissed, setDupDismissed] = useState(false);

  /**
   * 충돌 해결 모달에 넘길 컨텍스트. 사용자가 "이 거래와 합치기"를 눌렀을 때
   * 자동 보강(autoFills)은 즉시 적용되고, 남은 conflicts만 여기에 담아 모달을 띄웁니다.
   */
  const [pendingMerge, setPendingMerge] = useState<{
    existing: TxRow;
    plan: EnrichmentPlan;
    /** 사용자 입력 측의 거래명 — 모달 헤더에서 두 거래를 구분하기 위해 함께 넘깁니다. */
    incomingTitle: string;
  } | null>(null);

  // 날짜 또는 금액이 바뀌면 제안 상태를 초기화해 다시 판단할 수 있게 합니다.
  useEffect(() => {
    setDupConfirmed(false);
    setDupDismissed(false);
  }, [meta.date, meta.amount]);

  const showSuggestion =
    candidateMatches.length > 0 && !dupConfirmed && !dupDismissed;

  /** autoResolve 후 건너뜀 항목이 있을 때만 표시하는 결과 모달. */
  const [saveResult, setSaveResult] = useState<{
    savedRows: TxRow[];
    mergedActions: MergeAction[];
    skipped: ReturnType<typeof autoResolveDuplicates>["skipped"];
  } | null>(null);

  /**
   * 상품 합계가 거래 총 금액과 어긋날 때 띄우는 경고 모달 상태.
   * - mode="exceeds"는 블로킹 — entries만 채우고 확인만 가능.
   * - mode="under"는 pendingRow를 함께 담아 "이대로 등록" 시 partial 플래그를 붙여 저장합니다.
   */
  const [totalWarning, setTotalWarning] = useState<{
    mode: "exceeds" | "under";
    entries: ProductTotalWarningEntry[];
    pendingRow?: TxRow;
  } | null>(null);

  const editingProduct =
    modal?.type === "edit"
      ? products.find((product) => product.id === modal.id) ?? null
      : null;

  const handleSubmit = (payload: ProductAddPayload) => {
    if (modal?.type === "edit") {
      // 수정 저장 시 해당 id의 상품 항목만 새 값으로 교체합니다.
      setProducts((current) =>
        current.map((product) =>
          product.id === modal.id ? { ...product, ...payload } : product
        )
      );
    } else {
      // 데모 단계에서는 간단히 현재 시간값을 id로 써서 새 상품 행을 구분합니다.
      setProducts((current) => [
        ...current,
        { ...payload, id: String(Date.now()) },
      ]);
    }
    setModal(null);
  };

  /**
   * 현재 폼 상태로부터 TxRow를 빌드합니다. 필수값이 비어 있으면 null을 반환하고,
   * onError 콜백으로 어떤 항목이 비었는지 보고합니다.
   * handleSave와 handleMergeWith 양쪽에서 같은 규칙을 공유하기 위해 분리했습니다.
   */
  const buildRowFromForm = (onError: (message: string) => void): TxRow | null => {
    const amountNumber = Number(meta.amount.replace(/[^0-9]/g, ""));
    if (!meta.title.trim()) {
      onError("거래명을 입력해 주세요.");
      focusMetaField("title");
      return null;
    }
    if (!amountNumber || Number.isNaN(amountNumber)) {
      onError("금액을 숫자로 입력해 주세요.");
      focusMetaField("amount");
      return null;
    }
    if (!meta.date.trim()) {
      onError("거래일자를 선택해 주세요.");
      focusMetaField("date");
      return null;
    }
    const signedAmount =
      type === "expense" ? -Math.abs(amountNumber) : Math.abs(amountNumber);
    return {
      id: `m_${Date.now()}`,
      type,
      title: meta.title.trim(),
      amount: signedAmount,
      date: meta.date.trim(),
      platform: mapPlatform(meta.platform),
      categories: mapCategories(meta.categories),
      status:
        status && isValidStatusForType(status, type)
          ? status
          : defaultStatusForType(type),
      source: "manual",
      memo: meta.memo.trim() || undefined,
      detail:
        products.length > 0
          ? {
              items: products.map((product) => ({
                name: product.name,
                price: product.price,
                link: product.link,
              })),
              source: "MANUAL",
            }
          : undefined,
    };
  };

  /**
   * 사용자가 후보 카드에서 "이 거래와 합치기"를 눌렀을 때 호출됩니다.
   * 1) 현재 폼으로 incoming TxRow를 만들고,
   * 2) planEnrichment로 기존 거래에 옮겨 심을 수 있는 필드를 계산한 뒤,
   * 3) 자동 보강(autoFills)은 바로 updateOne으로 적용하고,
   * 4) 새 아이템은 appendItemsToTransaction으로 기존 거래에 추가하며,
   * 5) 충돌이 있으면 ConflictResolveModal을 열어 사용자가 직접 선택하도록 합니다.
   * 충돌이 없으면 곧바로 거래내역 페이지로 이동해 "머지 완료" 상태를 보여줍니다.
   */
  const handleMergeWith = (existingRow: TxRow) => {
    const incoming = buildRowFromForm(setError);
    if (!incoming) return;
    const mergeCheck = checkDuplicates([incoming], [existingRow]);
    const changedItemDiff = mergeCheck.itemDiff[0];
    if (changedItemDiff && changedItemDiff.changedItems.length > 0) {
      const changedNames = changedItemDiff.changedItems
        .map((item) => item.after.name)
        .slice(0, 2)
        .join(", ");
      const extraCount = Math.max(changedItemDiff.changedItems.length - 2, 0);
      setError(
        changedItemDiff.changedItems.length === 1
          ? `${changedNames} 상품 금액이 기존 거래와 달라서 합칠 수 없어요. 이 경우는 별도 거래로 저장해 주세요.`
          : extraCount > 0
            ? `${changedNames} 외 ${extraCount}개 상품 금액이 기존 거래와 달라서 합칠 수 없어요. 이 경우는 별도 거래로 저장해 주세요.`
            : `${changedNames} 상품 금액이 기존 거래와 달라서 합칠 수 없어요. 이 경우는 별도 거래로 저장해 주세요.`
      );
      return;
    }
    const plan = planEnrichment(incoming, existingRow);

    // 자동 보강은 사용자에게 묻지 않고 즉시 반영합니다. "기존이 비어 있던 자리를 채우는" 동작뿐이라
    // 잃을 게 없습니다.
    if (plan.autoFills.length > 0) {
      transactionsStore.updateOne(
        existingRow.id,
        combinePatches(plan.autoFills.map((fill) => fill.patch))
      );
    }
    if (plan.newItems.length > 0) {
      transactionsStore.appendItemsToTransaction(
        existingRow.id,
        plan.newItems,
        "MANUAL"
      );
    }

    // 새 입력은 저장하지 않습니다(사용자가 "같은 거래"라고 확정했으므로).
    setDupConfirmed(true);

    if (plan.conflicts.length > 0) {
      // 가장 최신의 existing 상태를 넘겨야 모달 헤더의 제목이 맞습니다.
      // updateOne 이후를 반영하려면 스토어에서 다시 읽어와야 하지만, title은 autoFills로 바뀌지 않으므로
      // existingRow 그대로 써도 헤더 표시는 정확합니다.
      setPendingMerge({
        existing: existingRow,
        plan,
        incomingTitle: incoming.title,
      });
      return;
    }

    // 충돌 없이 전부 처리됐으면 곧바로 거래내역으로 이동.
    navigate("/transactions");
  };

  /**
   * 중복 감지 → autoResolve → 저장까지의 실제 저장 경로. 상품 합계 확인을 통과한 뒤에만
   * 호출됩니다. "이대로 등록"을 거친 경우 buildRowFromForm이 만든 row에 itemsCoverage:"partial"이
   * 이미 붙어 들어옵니다.
   */
  const performSave = (row: TxRow) => {
    const dupResult = checkDuplicates([row], allRows);
    const resolved = autoResolveDuplicates(dupResult);

    if (resolved.toSave.length > 0) {
      transactionsStore.addOne(resolved.toSave[0]);
    }
    for (const action of resolved.toMerge) {
      transactionsStore.appendItemsToTransaction(action.existingId, action.newItems, "MANUAL");
    }

    // 무언가 저장됐으면 거래내역으로 바로 이동합니다.
    if (resolved.toSave.length > 0 || resolved.toMerge.length > 0) {
      navigate("/transactions");
      return;
    }

    // 저장된 것이 없으면 (exactDup만 있는 경우) 결과 모달로 사유를 표시합니다.
    setSaveResult({
      savedRows: [],
      mergedActions: [],
      skipped: resolved.skipped,
    });
  };

  /**
   * '거래 저장하기'를 누르면 필수 값 검사 → 상품 합계 확인 → 중복 감지 → 저장 순으로 진행합니다.
   *
   * 상품 합계 검사는 products.length > 0일 때만 의미가 있고, 단순히 금액을 숫자로 입력한 뒤
   * 상품 행을 하나도 추가하지 않은 거래에는 적용하지 않습니다. 이유는 "상품이 빠진 것"은
   * 이 화면에서 볼 때 정상 흐름(예: 통신비 요금처럼 상품 개념이 없는 지출)이기 때문입니다.
   */
  const handleSave = () => {
    // "맞아요"로 이미 같은 항목임을 확정했으면 저장하지 않습니다.
    if (dupConfirmed) return;
    const row = buildRowFromForm(setError);
    if (!row) return;

    // 상품이 있을 때만 합계 검증을 실행합니다. 없는 거래는 통신비·구독 등 "상품 개념이 없는" 지출도
    // 많기 때문에, 상품 자체를 강제하지 않고 "있으면 일치를 본다"는 규약으로 둡니다.
    if (row.detail?.items.length) {
      const totalCheck = checkProductTotal({
        totalAmount: row.amount,
        products: row.detail.items,
      });
      if (totalCheck.status === "exceeds") {
        setTotalWarning({
          mode: "exceeds",
          entries: [
            {
              label: row.title,
              totalAmount: row.amount,
              productsSum: totalCheck.productsSum,
              diff: totalCheck.diff,
            },
          ],
        });
        return;
      }
      if (totalCheck.status === "under") {
        // pendingRow에 partial 플래그를 미리 붙여 둡니다. 사용자가 "이대로 등록"을 고르면
        // 같은 객체를 그대로 performSave에 넘겨 최종 저장합니다.
        const partialRow: TxRow = {
          ...row,
          detail: row.detail ? { ...row.detail, itemsCoverage: "partial" } : undefined,
        };
        setTotalWarning({
          mode: "under",
          entries: [
            {
              label: row.title,
              totalAmount: row.amount,
              productsSum: totalCheck.productsSum,
              diff: totalCheck.diff,
            },
          ],
          pendingRow: partialRow,
        });
        return;
      }
    }

    performSave(row);
  };

  return (
    <AppShell activeNav="upload" crumb="입력 · 수동" title="수동 입력">
      <Card>
        <CardBd>
          <Lead>지출 또는 수입 내역을 직접 기록해 보세요.</Lead>

          <SectionLabel>거래 유형</SectionLabel>
          <div style={{ marginBottom: 16 }}>
            <TypeSegment
              value={type}
              onChange={(nextType) => {
                setType(nextType);
                // 유형이 바뀌면 반대편 전용 상태(예: 지출의 "구매", 수입의 "취소")가
                // 남아있지 않도록, 새 유형에서 유효하지 않으면 안전 디폴트로 자동 전환합니다.
                setStatus((currentStatus) =>
                  currentStatus && isValidStatusForType(currentStatus, nextType)
                    ? currentStatus
                    : defaultStatusForType(nextType)
                );
              }}
            />
          </div>

          <MetaFields
            fieldIdPrefix="manual"
            value={meta}
            onChange={(next) => {
              setMeta(next);
              if (error) setError(null);
            }}
          />

          {/* ── 실시간 중복 제안 카드 ── */}
          {showSuggestion && (
            <SuggestionCard>
              <SuggestionTitle>
                <span>🔍</span>
                <span>날짜·금액이 같은 항목이 있어요</span>
              </SuggestionTitle>
              <SuggestionSub>
                혹시 이걸 입력하시려는 건 아닌가요? 같은 거래라면 해당 행의
                '이 거래와 합치기'를 눌러 플랫폼·메모·카테고리·상품을 한 번에 옮겨 심을 수 있어요.
              </SuggestionSub>
              <SuggestionList>
                {candidateMatches.map((row) => (
                  <SuggestionItem key={row.id}>
                    <SuggestionItemInfo>
                      <SuggestionItemTitle>{row.title}</SuggestionItemTitle>
                      <SuggestionItemMeta>
                        {row.date} · {formatKRW(Math.abs(row.amount))}
                      </SuggestionItemMeta>
                    </SuggestionItemInfo>
                    <MergeBtn
                      type="button"
                      onClick={() => handleMergeWith(row)}
                    >
                      이 거래와 합치기
                    </MergeBtn>
                  </SuggestionItem>
                ))}
              </SuggestionList>
              <SuggestionActions>
                <SuggestionBtn
                  type="button"
                  onClick={() => setDupDismissed(true)}
                >
                  아니에요, 계속 입력할게요
                </SuggestionBtn>
              </SuggestionActions>
            </SuggestionCard>
          )}

          {/* "맞아요" 확정 후 안내 배너 */}
          {dupConfirmed && (
            <DupConfirmedBanner>
              <strong>이미 등록된 항목이에요.</strong> 같은 거래가 이미 있어서 저장하지 않을게요.
              다른 거래라면 날짜나 금액을 바꾸면 다시 확인할 수 있어요.
            </DupConfirmedBanner>
          )}

          <SectionLabel>상태 태그</SectionLabel>
          <div style={{ marginBottom: 20 }}>
            <StatusTags value={status} type={type} onChange={setStatus} />
          </div>

          <SectionHeader>
            <SectionLabel style={{ margin: 0 }}>등록된 상품</SectionLabel>
            <AddButton type="button" onClick={() => setModal({ type: "add" })}>
              + 상품 추가
            </AddButton>
          </SectionHeader>
          {/* 거래 하나 안에 여러 상품이 들어갈 수 있다는 점을 여기서 보여줍니다. */}
          <SectionHint>
            상품을 추가하면 거래에 포함된 구매 항목을 함께 기록할 수 있어요.
            수정이 필요하면 행의 '수정'을 눌러보세요.
          </SectionHint>
          <ProductRows
            products={products}
            onEdit={(id) => setModal({ type: "edit", id })}
            onRemove={(id) =>
              setProducts((current) =>
                current.filter((product) => product.id !== id)
              )
            }
          />

          {error && <ErrorLine role="alert">{error}</ErrorLine>}

          <SaveBar data-tour="manual-savebar">
            <Button
              variant="primary"
              size="lg"
              block
              disabled={dupConfirmed}
              onClick={() => {
                setSaveResult(null);
                setError(null);
                handleSave();
              }}
            >
              {dupConfirmed ? "이미 등록된 항목이에요" : "거래 저장하기"}
            </Button>
          </SaveBar>

          <Foot>상품 추가 후 상품명, 금액, 링크를 한 번에 입력할 수 있어요.</Foot>
        </CardBd>
      </Card>

      <ProductAddModal
        isOpen={modal !== null}
        initialValues={editingProduct}
        onClose={() => setModal(null)}
        onSubmit={handleSubmit}
      />

      {saveResult && (
        <SaveResultModal
          isOpen
          savedRows={saveResult.savedRows}
          mergedActions={saveResult.mergedActions}
          allRows={allRows}
          skipped={saveResult.skipped}
          onConfirm={() => {
            setSaveResult(null);
            navigate("/transactions");
          }}
        />
      )}

      {/*
        충돌 해결 모달은 사용자가 "이 거래와 합치기"를 누른 뒤 자동 보강으로 처리할 수 없는
        필드가 남아있을 때만 띄웁니다. 모달에서 '선택 적용'을 누르면 합쳐진 patch를
        updateOne으로 기존 거래에 반영한 뒤 거래내역 페이지로 이동합니다. '취소'를 눌러도
        이미 autoFills와 newItems는 반영된 상태이기 때문에, 사용자가 본인 입력으로 다시
        돌아갈 이유가 없어 마찬가지로 거래내역 페이지로 이동시킵니다.
      */}
      {pendingMerge && (
        <ConflictResolveModal
          isOpen
          existing={pendingMerge.existing}
          conflicts={pendingMerge.plan.conflicts}
          incomingTitle={pendingMerge.incomingTitle}
          onConfirm={(patch) => {
            if (Object.keys(patch).length > 0) {
              transactionsStore.updateOne(pendingMerge.existing.id, patch);
            }
            setPendingMerge(null);
            navigate("/transactions");
          }}
          onCancel={() => {
            setPendingMerge(null);
            navigate("/transactions");
          }}
        />
      )}

      {/*
        상품 합계 경고 모달. handleSave에서 exceeds/under를 감지하면 이 모달이 뜨고,
        나머지 저장 로직은 일시 정지됩니다.
        - "exceeds"는 블로킹: 확인 버튼만 있고, 닫히면 사용자가 직접 값을 교정해야 합니다.
        - "under"는 선택: "이대로 등록"을 고르면 pendingRow(이미 partial 플래그가 붙어 있는)를
          그대로 performSave에 넘깁니다.
      */}
      {totalWarning && (
        <ProductTotalWarningModal
          isOpen
          mode={totalWarning.mode}
          entries={totalWarning.entries}
          onConfirm={() => {
            const pending = totalWarning.pendingRow;
            setTotalWarning(null);
            if (pending) performSave(pending);
          }}
          onCancel={() => setTotalWarning(null)}
        />
      )}
    </AppShell>
  );
};
