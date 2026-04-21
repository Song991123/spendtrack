/**
 * 역할: 카드사 이용내역 파일(CSV/XLSX)을 읽어 거래 스토어에 결제내역을 벌크 등록하는 화면입니다.
 *       업로드 → 파싱 프리뷰 → 사용자 확정 → 스토어 저장의 3단 흐름을 가집니다.
 *       확장자를 감지해 CSV/XLSX 파서를 자동으로 선택합니다.
 * 위치: src\pages\CsvUpload\index.tsx
 */
import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { Button } from "../../components/primitives/Button";
import { Card, CardBd, CardHd, CardTitle } from "../../components/primitives/Card";
import { tokens } from "../../styles/tokens";
import { media } from "../../tokens/breakpoints";
import { transactionsStore } from "../../stores/transactionsStore";
import type { CsvImportResult } from "../../utils/csvImport";
import { importFile, UnsupportedFileTypeError } from "../../utils/fileImport";
import { PreviewTable } from "./components/PreviewTable";

const Body = styled.div`
  display: grid;
  gap: 16px;
`;

const Dropzone = styled.label<{ $active?: boolean }>`
  display: block;
  padding: 36px 24px;
  border: 2px dashed
    ${({ $active }) => ($active ? tokens.color.accent : tokens.color.line)};
  border-radius: ${tokens.radius.card};
  background: ${({ $active }) =>
    $active ? tokens.color.accentSubtle : tokens.color.panel};
  color: ${tokens.color.ink2};
  text-align: center;
  cursor: pointer;
  transition:
    border-color ${tokens.motion.fast} ease,
    background ${tokens.motion.fast} ease;

  &:hover {
    border-color: ${tokens.color.accent};
  }

  .title {
    margin-bottom: 4px;
    color: ${tokens.color.ink1};
    font-size: 14px;
    font-weight: 600;
  }

  .hint {
    color: ${tokens.color.ink4};
    font-size: 12px;
    line-height: 1.6;
  }

  input {
    display: none;
  }
`;

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid ${tokens.color.line2};

  ${media.mobile} {
    grid-template-columns: 1fr;
  }

  .item {
    .label {
      color: ${tokens.color.ink4};
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .value {
      margin-top: 4px;
      color: ${tokens.color.ink1};
      font-size: 18px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
  }
`;

const SkippedBlock = styled.div`
  padding: 14px 16px;
  border-top: 1px solid ${tokens.color.line2};
  background: ${tokens.color.foot};

  .head {
    color: ${tokens.color.warn};
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  ul {
    margin: 0;
    padding-left: 18px;
    color: ${tokens.color.ink3};
    font-size: 12px;
    line-height: 1.7;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  ${media.mobile} {
    flex-direction: column-reverse;
  }
`;

const Hint = styled.div`
  padding: 14px 16px;
  color: ${tokens.color.ink4};
  font-size: 12px;
  line-height: 1.6;
  background: ${tokens.color.foot};
  border-top: 1px solid ${tokens.color.line2};
`;

export const CsvUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<CsvImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const hasValidRows = useMemo(
    () => Boolean(result && result.imported.length > 0),
    [result]
  );

  const handleFile = async (file: File) => {
    setError(null);
    setFileName(file.name);
    try {
      const parsed = await importFile(file);
      setResult(parsed);
    } catch (cause) {
      setResult(null);
      if (cause instanceof UnsupportedFileTypeError) {
        setError(cause.message);
      } else {
        setError(
          cause instanceof Error
            ? cause.message
            : "파일을 읽는 중 문제가 발생했어요."
        );
      }
    }
  };

  const handleConfirm = () => {
    if (!result || result.imported.length === 0) return;
    transactionsStore.addMany(result.imported);
    navigate("/transactions");
  };

  const handleReset = () => {
    setFileName(null);
    setResult(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <AppShell
      activeNav="upload"
      crumb="입력 · 카드 내역"
      title="카드 내역 가져오기"
    >
      <Body>
        <Card padding={0}>
          <CardHd>
            <CardTitle>CSV 또는 엑셀 업로드</CardTitle>
          </CardHd>
          <CardBd>
            <Dropzone
              data-tour="csv-zone"
              $active={dragActive}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
            >
              <div className="title">
                {fileName ? fileName : "카드사 이용내역 파일을 올려주세요"}
              </div>
              <div className="hint">
                CSV 또는 XLSX 모두 지원합니다. 클릭하거나 파일을 끌어다 놓으세요.
                <br />
                헤더는 이용일 / 가맹점명 / 이용금액 / (선택)카테고리 형식을 따르며, 상단 안내 행이 있어도 자동으로 건너뜁니다.
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </Dropzone>
            {error && (
              <div
                style={{
                  marginTop: 12,
                  color: tokens.color.neg,
                  fontSize: 12,
                }}
              >
                {error}
              </div>
            )}
          </CardBd>
        </Card>

        {result && (
          <Card padding={0}>
            <CardHd>
              <CardTitle>파싱 결과 미리보기</CardTitle>
            </CardHd>
            <SummaryRow>
              <div className="item">
                <div className="label">총 행</div>
                <div className="value">{result.total}</div>
              </div>
              <div className="item">
                <div className="label">반영될 거래</div>
                <div className="value" style={{ color: tokens.color.pos }}>
                  {result.imported.length}
                </div>
              </div>
              <div className="item">
                <div className="label">건너뛴 행</div>
                <div
                  className="value"
                  style={{
                    color:
                      result.skipped.length > 0
                        ? tokens.color.warn
                        : tokens.color.ink4,
                  }}
                >
                  {result.skipped.length}
                </div>
              </div>
            </SummaryRow>
            <PreviewTable rows={result.imported} />
            {result.skipped.length > 0 && (
              <SkippedBlock>
                <div className="head">건너뛴 행 사유</div>
                <ul>
                  {result.skipped.slice(0, 8).map((item) => (
                    <li key={item.index}>
                      {item.index + 1}행: {item.reason}
                    </li>
                  ))}
                  {result.skipped.length > 8 && (
                    <li>… 외 {result.skipped.length - 8}건</li>
                  )}
                </ul>
              </SkippedBlock>
            )}
            <Hint>
              카드사 이용내역 파일은 상품 상세를 포함하지 않아, 여기서는 플랫폼·금액·날짜 중심으로 등록됩니다.
              상품 정보는 이후 OCR 업로드 또는 수동 입력에서 해당 거래에 덧붙일 수 있습니다.
            </Hint>
          </Card>
        )}

        <Actions>
          <Button variant="ghost" size="lg" onClick={handleReset}>
            다시 선택
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            disabled={!hasValidRows}
          >
            {hasValidRows
              ? `${result?.imported.length}건 거래 저장`
              : "파일을 먼저 올려주세요"}
          </Button>
        </Actions>
      </Body>
    </AppShell>
  );
};
