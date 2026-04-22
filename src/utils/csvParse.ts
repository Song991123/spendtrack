/**
 * 역할: CSV 텍스트를 헤더 기반 객체 배열로 파싱합니다.
 *       Excel/카드사 CSV에서 흔한 BOM과 따옴표로 감싼 셀을 처리할 수 있게 만들었습니다.
 * 위치: src\utils\csvParse.ts
 */
import { findHeaderRowIndex } from "./importHeaders";

export type CsvRow = Record<string, string>;

export function decodeCsvBuffer(buffer: ArrayBuffer): string {
  const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  if (!utf8.includes("\uFFFD")) return utf8;

  try {
    return new TextDecoder("euc-kr").decode(buffer);
  } catch {
    return utf8;
  }
}

export function parseCsvMatrix(text: string): string[][] {
  const cleaned = text.replace(/^\uFEFF/, "");
  const matrix: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < cleaned.length; i += 1) {
    const ch = cleaned[i];
    const nextCh = cleaned[i + 1];

    if (ch === '"') {
      if (inQuotes && nextCh === '"') {
        currentCell += '"';
        i += 1; // 이스케이프된 따옴표 건너뛰기
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
    } else if ((ch === "\r" || ch === "\n") && !inQuotes) {
      if (ch === "\r" && nextCh === "\n") {
        i += 1; // CRLF 처리
      }
      currentRow.push(currentCell);
      // 빈 줄 무시
      if (currentRow.some((c) => c.trim() !== "")) {
        matrix.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += ch;
    }
  }

  // 마지막 셀과 행 처리
  if (currentCell !== "" || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.some((c) => c.trim() !== "")) {
      matrix.push(currentRow);
    }
  }

  return matrix.map((row) => row.map((cell) => cell.trim()));
}

export function rowsToCsvRows(rows: string[][], headerIndex = 0): CsvRow[] {
  if (rows.length <= headerIndex + 1) return [];

  let headers = (rows[headerIndex] ?? []).map((header) => String(header));
  let dataStartIndex = headerIndex + 1;

  // 다음 행이 데이터 행인지 확인 (날짜 형식이 포함되어 있는지)
  const nextRow = rows[headerIndex + 1] ?? [];
  const hasDateInNextRow = nextRow.some((cell) => {
    const text = String(cell);
    return /\d{4}[-./]\d{1,2}[-./]\d{1,2}/.test(text) || /\d{2}[-./]\d{1,2}[-./]\d{1,2}/.test(text);
  });

  // 날짜가 없고 텍스트가 있다면 두 행으로 쪼개진 헤더로 간주하고 병합합니다.
  if (!hasDateInNextRow && nextRow.some((cell) => /[가-힣a-zA-Z]/.test(String(cell)))) {
    headers = headers.map((h, i) => `${h}${String(nextRow[i] ?? "")}`);
    dataStartIndex = headerIndex + 2;
  }

  // 병합된 헤더 또는 기존 헤더에서 줄바꿈(Shift+Enter) 및 모든 공백을 제거합니다.
  const cleanedHeaders = headers.map((header) => header.replace(/\s+/g, ""));

  return rows.slice(dataStartIndex).reduce<CsvRow[]>((acc, cells) => {
    const row: CsvRow = {};
    let hasValue = false;

    cleanedHeaders.forEach((header, index) => {
      if (!header) return;
      const value = String(cells[index] ?? "").trim();
      row[header] = value;
      if (value !== "") hasValue = true;
    });

    if (hasValue) acc.push(row);
    return acc;
  }, []);
}

export function parseCsv(text: string): CsvRow[] {
  const matrix = parseCsvMatrix(text);
  if (matrix.length < 2) return [];
  return rowsToCsvRows(matrix, findHeaderRowIndex(matrix));
}
