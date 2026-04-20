/**
 * 역할: 카드 XLSX 파일을 CsvRow[] 형태로 변환합니다.
 * 위치: src\utils\xlsxImport.ts
 */
import { rowsToCsvRows, type CsvRow } from "./csvParse";
import { findHeaderRowIndex } from "./importHeaders";

export async function readXlsxAsRows(file: File): Promise<CsvRow[]> {
  // xlsx는 업로드 시점에만 동적으로 불러와 초기 번들을 가볍게 유지합니다.
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

  const matrix = aoa.map((cells) => cells.map((cell) => String(cell ?? "").trim()));
  return rowsToCsvRows(matrix, findHeaderRowIndex(matrix));
}
