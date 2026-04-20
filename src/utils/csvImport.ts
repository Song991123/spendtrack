/**
 * 역할: 카드사 이용내역(CSV/XLSX)에서 뽑아낸 행 데이터를 SpendTrack의 TxRow[]로 변환합니다.
 *       CSV 텍스트 진입점(importCsv)과 행 배열 진입점(importRows)을 모두 노출해
 *       XLSX 파서도 같은 변환 로직을 재사용할 수 있게 했습니다.
 * 위치: src\utils\csvImport.ts
 */
import type {
  TxCategory,
  TxRow,
  TxStatus,
} from "../pages/Transactions/components/TransactionTable";
import { parseCsv, type CsvRow } from "./csvParse";
import { normalizeMerchant } from "./merchantNormalize";

const CATEGORY_MAP: Record<string, TxCategory> = {
  생활용품: "living",
  생활: "living",
  "패션/의류": "fashion",
  패션: "fashion",
  의류: "fashion",
  전자기기: "digital",
  전자: "digital",
  디지털: "digital",
  "식품/음료": "food",
  식품: "food",
  음료: "food",
};

function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/,/g, "").replace(/원|KRW/g, "").trim();
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function normalizeDate(raw: string): string | null {
  const match = raw.trim().match(/(\d{4})[-./]?(\d{1,2})[-./]?(\d{1,2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  return `${year}.${month.padStart(2, "0")}.${day.padStart(2, "0")}`;
}

export interface CsvImportSkipped {
  index: number;
  reason: string;
  raw: Record<string, string>;
}

export interface CsvImportResult {
  total: number;
  imported: TxRow[];
  skipped: CsvImportSkipped[];
}

/**
 * 이미 CsvRow[] 형태로 파싱된 데이터를 TxRow[]로 변환합니다.
 * CSV와 XLSX 양쪽 모두 이 함수를 공용으로 재사용합니다.
 */
export function importRows(parsed: CsvRow[]): CsvImportResult {
  const imported: TxRow[] = [];
  const skipped: CsvImportSkipped[] = [];
  const now = Date.now();

  parsed.forEach((raw, index) => {
    const dateRaw =
      raw["이용일"] ||
      raw["거래일"] ||
      raw["결제일"] ||
      raw["승인일"] ||
      raw["date"] ||
      "";
    const merchantRaw =
      raw["가맹점명"] || raw["가맹점"] || raw["사용처"] || raw["merchant"] || "";
    const amountRaw =
      raw["이용금액"] || raw["금액"] || raw["결제금액"] || raw["amount"] || "";
    const categoryRaw = raw["카테고리"] || raw["category"] || "";

    const date = normalizeDate(dateRaw);
    const amount = parseAmount(amountRaw);
    const { platform, cleaned } = normalizeMerchant(merchantRaw);

    if (!merchantRaw) {
      skipped.push({ index, reason: "가맹점명 누락", raw });
      return;
    }
    if (!date) {
      skipped.push({ index, reason: "날짜 형식을 읽을 수 없음", raw });
      return;
    }
    if (amount === null) {
      skipped.push({ index, reason: "금액을 읽을 수 없음", raw });
      return;
    }
    if (!platform) {
      skipped.push({
        index,
        reason: `지원 플랫폼이 아님 (${cleaned || merchantRaw})`,
        raw,
      });
      return;
    }

    const category = (CATEGORY_MAP[categoryRaw.trim()] ?? "living") as TxCategory;
    const status: TxStatus = "purchase";

    const row: TxRow = {
      id: `csv-${now}-${index}`,
      type: "expense",
      date,
      platform,
      category,
      title: cleaned || merchantRaw,
      amount: -Math.abs(amount),
      status,
      source: "csv",
    };

    imported.push(row);
  });

  return { total: parsed.length, imported, skipped };
}

/**
 * CSV 텍스트를 받아 TxRow[]로 변환합니다. 내부적으로 parseCsv + importRows를 합친 형태입니다.
 */
export function importCsv(text: string): CsvImportResult {
  return importRows(parseCsv(text));
}
