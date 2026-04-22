/**
 * 역할: OCR로 읽어온 원문 텍스트에서 거래 상태(statusTag)를 자동으로 추정합니다.
 *       팀 논의 결론(자동 인식 + 사용자 확정 하이브리드) 중 "자동 인식" 단계를 담당하며,
 *       추정 결과가 틀렸을 때 사용자는 OcrEdit/EditForm의 EditableStatusTag에서
 *       한 번의 클릭으로 보정할 수 있습니다.
 *
 *       현재 v1 mock 흐름에서는 실제 OCR 텍스트가 없어 호출되지 않지만, Tesseract.js
 *       등이 실제로 붙는 시점에 훅업할 수 있도록 동일 타입 시스템 위에 두었습니다.
 *
 * 위치: src\utils\ocrParse.ts
 */
import type { Status } from "../pages/OcrEdit/data";

/**
 * 상태별로 쇼핑몰 캡쳐에서 자주 노출되는 한국어 키워드.
 *
 * 한 캡쳐에 여러 상태가 섞이는 경우(예: "주문 취소 완료", "결제 완료 · 환불 요청")를
 * 고려해 우선순위를 고정합니다.
 * - 환불/취소/반품을 먼저 체크하는 이유: "구매" 관련 키워드("주문완료", "결제완료")가
 *   환불/취소 행에도 동시 노출되는 경우가 많아, 구매를 먼저 매칭하면 오판이 늘어납니다.
 * - 정기결제는 단독 라벨로 표기되는 경우가 많아 순서에 큰 영향이 없지만,
 *   일반 구매보다는 앞에 두어 우선 인식합니다.
 */
const STATUS_KEYWORDS: Array<{ status: Status; keywords: string[] }> = [
  { status: "refund", keywords: ["환불", "환불완료", "환불처리", "반품", "반품완료"] },
  { status: "cancel", keywords: ["취소", "주문취소", "결제취소"] },
  { status: "sub", keywords: ["정기결제", "정기 결제", "구독", "자동결제"] },
  { status: "purchase", keywords: ["구매", "주문완료", "결제완료", "배송완료", "배송중"] },
];

/**
 * OCR 원문 전체에서 상태 키워드를 찾아 첫 매칭값을 반환합니다.
 * 키워드가 아무것도 매칭되지 않으면 undefined를 돌려주어, 호출부가
 * 기본값(쇼핑 컨텍스트에서는 보통 "purchase")을 결정하거나 사용자에게
 * 명시적으로 고르도록 유도할 수 있게 합니다.
 *
 * 실제 서비스에서는 쇼핑몰별 파서(쿠팡/네이버페이/11번가 등)를 먼저 태우고,
 * 폴백으로 이 키워드 매칭을 태우는 2단 구조가 자연스럽습니다.
 */
export function detectStatusFromOcrText(text: string): Status | undefined {
  if (!text) return undefined;
  // 공백/개행 차이로 매칭이 어긋나지 않도록 정규화 후 포함 여부만 확인합니다.
  const normalized = text.replace(/\s+/g, "");

  for (const { status, keywords } of STATUS_KEYWORDS) {
    const hit = keywords.some((keyword) =>
      normalized.includes(keyword.replace(/\s+/g, ""))
    );
    if (hit) return status;
  }
  return undefined;
}

/**
 * 한 캡쳐 안에 여러 상태가 섞여 있을 때, 상품/행 단위로 상태를 추정합니다.
 * 라인별 OCR 결과(예: 각 상품 카드에서 추출한 텍스트 조각)를 넘기면 동일
 * 길이의 결과 배열을 돌려줍니다. 추후 라인 단위 OCR이 붙는 시점에 바로
 * 사용할 수 있도록 타입을 고정해 두었습니다.
 */
export function detectStatusPerLine(lines: string[]): Array<Status | undefined> {
  return lines.map((line) => detectStatusFromOcrText(line));
}
