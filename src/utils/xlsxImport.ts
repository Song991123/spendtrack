/**
 * 역할: 카드사 XLSX(엑셀) 파일을 CsvRow[] 형태로 변환합니다.
 *       카드사마다 상단에 안내 문구 행이 몇 줄 들어가는 경우가 많아,
 *       처음 10행을 훑으며 실제 헤더 행을 자동으로 감지합니다.
 *       xlsx 라이브러리는 번들 크기가 크기 때문에 동적 import로 실제 사용 시에만 로드합니다.
 * 위치: src\utils\xlsxImport.ts
 */
import type { CsvRow } from "./csvParse";

// 헤더 행 자동 감지에 사용할 키워드. 카드사별 변형까지 포괄합니다.
const HEADER_HINTS = [
  "이용일",
  "거래일",
  "승인일",
  "결제일",
  "가맹점",
  "사용처",
  "이용금액",
  "승인금액",
  "결제금액",
  "금액",
];

function findHeaderRowIndex(rows: string[][]): number {
  const maxPeek = Math.min(rows.length, 10);
  for (let i = 0; i < maxPeek; i += 1) {
    const cells = (rows[i] ?? []).map((cell) => String(cell ?? "").trim());
    const hits = cells.filter((cell) =>
      HEADER_HINTS.some((hint) => cell.includes(hint))
    );
    if (hits.length >= 2) return i;
  }
  return 0;
}

export async function readXlsxAsRows(file: File): Promise<CsvRow[]> {
  // 동적 import로 xlsx를 실제 업로드 시점에만 로드합니다. 초기 번들에서 제외되어 페이지 첫 로드가 가벼워집니다.
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];
  const sheet = workbook.Sheets[firstSheetName];
  const aoa = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    defval: "",
    raw: false,
    blankrows: false,
  });

  if (aoa.length === 0) return [];

  const headerIdx = findHeaderRowIndex(aoa);
  const headers = (aoa[headerIdx] ?? []).map((cell) => String(cell ?? "").trim());

  const rows: CsvRow[] = [];
  for (let i = headerIdx + 1; i < aoa.length; i += 1) {
    const cells = aoa[i] ?? [];
    const row: CsvRow = {};
    let hasValue = false;
    headers.forEach((header, columnIdx) => {
      if (!header) return;
      const value = String(cells[columnIdx] ?? "").trim();
      row[header] = value;
      if (value !== "") hasValue = true;
    });
    if (hasValue) rows.push(row);
  }
  return rows;
}
