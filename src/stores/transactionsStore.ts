/**
 * 역할: Transactions 전역 상태를 localStorage 기반으로 보관하는 간이 스토어.
 *       MVP 단계에서는 Firestore를 연결하지 않고 이 모듈을 통해서만 거래 데이터를 읽고 씁니다.
 *       추후 원격 저장소 연동으로 교체할 수 있도록 API 표면을 단순하게 유지합니다.
 * 위치: src\stores\transactionsStore.ts
 */
import { useEffect, useState } from "react";
import type { TxRow } from "../pages/Transactions/components/TransactionTable";
import { getTransactionsMockData } from "../pages/Transactions/data";

// v2: 거래 상세 상품 아이템에 link 필드가 추가된 시드. 이전 v1 캐시가 있어도 새 시드를 받도록 버전을 올립니다.
const STORAGE_KEY = "spendtrack:transactions:v2";
const SEED_MONTHS = ["2026-01", "2026-02", "2026-03", "2026-04"];

type Listener = (rows: TxRow[]) => void;
const listeners = new Set<Listener>();

function buildSeed(): TxRow[] {
  return SEED_MONTHS.flatMap((month) =>
    getTransactionsMockData(month).rows.map((row) => ({
      ...row,
      source: row.source ?? "mock",
    }))
  );
}

function readRaw(): TxRow[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TxRow[]) : null;
  } catch {
    return null;
  }
}

function writeRaw(rows: TxRow[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  listeners.forEach((listener) => listener(rows));
}

function ensureSeeded(): TxRow[] {
  const existing = readRaw();
  if (existing) return existing;
  const seed = buildSeed();
  writeRaw(seed);
  return seed;
}

export const transactionsStore = {
  loadAll(): TxRow[] {
    return ensureSeeded();
  },
  replaceAll(rows: TxRow[]): void {
    writeRaw(rows);
  },
  addMany(rows: TxRow[]): void {
    const current = ensureSeeded();
    writeRaw([...rows, ...current]);
  },
  addOne(row: TxRow): void {
    const current = ensureSeeded();
    writeRaw([row, ...current]);
  },
  updateOne(id: string, patch: Partial<TxRow>): void {
    const current = ensureSeeded();
    writeRaw(current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  },
  removeOne(id: string): void {
    const current = ensureSeeded();
    writeRaw(current.filter((row) => row.id !== id));
  },
  appendItemsToTransaction(
    id: string,
    items: { name: string; price: number; link?: string }[],
    source: "OCR" | "MANUAL" = "OCR"
  ): void {
    const current = ensureSeeded();
    writeRaw(
      current.map((row) => {
        if (row.id !== id) return row;
        const existingItems = row.detail?.items ?? [];
        return {
          ...row,
          detail: {
            items: [...existingItems, ...items],
            source: row.detail?.source ?? source,
          },
        };
      })
    );
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  /**
   * 개발/테스트용으로 스토어를 초기 시드 상태로 되돌립니다.
   * UI에서는 Settings 위험 구역 등 향후 확장 시점에 연결할 수 있습니다.
   */
  resetToSeed(): TxRow[] {
    const seed = buildSeed();
    writeRaw(seed);
    return seed;
  },
};

/**
 * 컴포넌트에서 스토어 상태를 구독하기 위한 훅.
 * 다른 탭의 변경은 storage 이벤트로, 같은 탭 내 변경은 내부 리스너로 반영됩니다.
 */
export function useTransactionsStore(): TxRow[] {
  const [rows, setRows] = useState<TxRow[]>(() => transactionsStore.loadAll());

  useEffect(() => {
    const unsubscribe = transactionsStore.subscribe(setRows);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setRows(transactionsStore.loadAll());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return rows;
}
