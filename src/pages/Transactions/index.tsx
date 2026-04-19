/**
 * 역할: 해당 화면의 상태와 레이아웃을 조립하는 페이지 진입 파일입니다.
 * 위치: src\pages\Transactions\index.tsx
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { MonthPicker } from "../../components/primitives/MonthPicker";
import { tokens } from "../../styles/tokens";
import { media } from "../../tokens/breakpoints";
import { SummaryStrip } from "./components/SummaryStrip";
import { FilterBar } from "./components/FilterBar";
import { TransactionTable } from "./components/TransactionTable";
import { DetailPanel } from "./components/DetailPanel";
import { buildTransactionSummary, getTransactionsMockData } from "./data";
import { getMonthOption } from "../../constants/months";

const Body = styled.div<{ $hasPanel: boolean }>`
  display: grid;
  grid-template-columns: ${({ $hasPanel }) =>
    $hasPanel ? "minmax(0, 1fr) 320px" : "minmax(0, 1fr) 0px"};
  gap: ${({ $hasPanel }) => ($hasPanel ? "16px" : "0px")};
  align-items: start;
  transition:
    grid-template-columns ${tokens.motion.fast} ease,
    gap ${tokens.motion.fast} ease;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Left = styled.div`
  display: grid;
  gap: 16px;
  min-width: 0;
`;

const PanelSlot = styled.div`
  min-width: 0;
  position: sticky;
  top: 20px;
  align-self: start;
  max-height: calc(100vh - 40px);
  overflow-x: hidden;
  overflow-y: auto;

  ${media.tablet} {
    position: static;
    max-height: none;
    overflow: visible;
  }
`;

const PanelInner = styled.div<{ $open: boolean }>`
  width: 320px;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateX(${({ $open }) => ($open ? "0" : "8px")});
  transition:
    opacity ${tokens.motion.fast} ease,
    transform ${tokens.motion.fast} ease;

  ${media.tablet} {
    width: 100%;
    transform: none;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 16px;
`;

export const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  // 필터 상태는 모두 페이지 상단에서 관리해서 표와 상세 패널이 같은 기준을 보게 합니다.
  const [month, setMonth] = useState("2026-04");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<"all" | "coupang" | "naver" | "musinsa">("all");
  const [category, setCategory] = useState<"all" | "living" | "fashion" | "digital" | "food">("all");

  const data = useMemo(() => getTransactionsMockData(month), [month]);
  const [rows, setRows] = useState(data.rows);
  const [selectedId, setSelectedId] = useState<string>(data.rows[0]?.id ?? "");
  const monthOption = getMonthOption(month);

  useEffect(() => {
    setRows(data.rows);
    setSelectedId(data.rows[0]?.id ?? "");
  }, [data.rows]);

  const filteredRows = useMemo(() => {
    // 검색어, 플랫폼, 카테고리 조건을 한 번에 적용해 실제 표에 보여줄 후보 목록을 만듭니다.
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      if (platform !== "all" && row.platform !== platform) {
        return false;
      }

      if (category !== "all" && row.category !== category) {
        return false;
      }

      if (!query) {
        return true;
      }

      const itemText = row.detail?.items.map((item) => item.name).join(" ").toLowerCase() ?? "";
      return row.title.toLowerCase().includes(query) || itemText.includes(query);
    });
  }, [category, platform, rows, search]);

  const INITIAL_VISIBLE = 20;
  const LOAD_STEP = 20;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    // 조건이 바뀌면 "더 보기" 개수도 처음 상태로 되돌려 다시 탐색하게 합니다.
    setVisibleCount(INITIAL_VISIBLE);
  }, [month, search, platform, category]);

  const visibleRows = useMemo(
    () => filteredRows.slice(0, visibleCount),
    [filteredRows, visibleCount]
  );

  const handleLoadMore = useCallback(() => {
    setVisibleCount((current) => {
      if (current >= filteredRows.length) return current;
      return Math.min(current + LOAD_STEP, filteredRows.length);
    });
  }, [filteredRows.length]);

  useEffect(() => {
    if (selectedId && !filteredRows.some((row) => row.id === selectedId)) {
      setSelectedId(filteredRows[0]?.id ?? "");
    }
  }, [filteredRows, selectedId]);

  const selected = useMemo(
    () => filteredRows.find((row) => row.id === selectedId) ?? null,
    [filteredRows, selectedId]
  );

  const [displayed, setDisplayed] = useState<typeof selected>(selected);
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(selected));

  useEffect(() => {
    // 상세 패널은 선택 항목이 바뀔 때 부드럽게 열리고 닫히도록 표시 상태를 분리합니다.
    if (selected) {
      setDisplayed(selected);
      const raf = requestAnimationFrame(() => setIsOpen(true));
      return () => cancelAnimationFrame(raf);
    }
    setIsOpen(false);
    const timer = window.setTimeout(() => setDisplayed(null), 160);
    return () => window.clearTimeout(timer);
  }, [selected]);

  const handleDelete = () => {
    if (!selected) {
      return;
    }

    // 삭제 후에는 가능한 한 바로 다음 또는 이전 행을 선택해 사용 흐름이 끊기지 않게 합니다.
    const currentIndex = filteredRows.findIndex((row) => row.id === selected.id);
    const nextSelectedId =
      filteredRows[currentIndex + 1]?.id ??
      filteredRows[currentIndex - 1]?.id ??
      "";

    setRows((prevRows) => prevRows.filter((row) => row.id !== selected.id));
    setSelectedId(nextSelectedId);
  };

  return (
    <AppShell
      activeNav="transactions"
      crumb={`거래 · ${monthOption.label}`}
      title="수입·지출 내역"
      headerRight={<MonthPicker value={month} onChange={setMonth} />}
    >
      <Grid>
        <SummaryStrip summary={buildTransactionSummary(rows)} />
        <Body $hasPanel={isOpen}>
          <Left>
            {/* 왼쪽 영역은 필터와 표, 오른쪽 영역은 상세 패널로 역할을 분리합니다. */}
            <FilterBar
              totalLabel={`현재 결과 ${filteredRows.length}건`}
              search={search}
              platform={platform}
              category={category}
              onSearchChange={setSearch}
              onPlatformChange={setPlatform}
              onCategoryChange={setCategory}
            />
            <TransactionTable
              rows={visibleRows}
              totalCount={filteredRows.length}
              selectedId={selected?.id ?? ""}
              onSelect={setSelectedId}
              onLoadMore={handleLoadMore}
            />
          </Left>
          <PanelSlot>
            {displayed && (
              <PanelInner $open={isOpen}>
                <DetailPanel
                  row={displayed}
                  onClose={() => setSelectedId("")}
                  onEdit={() => navigate("/manual-entry")}
                  onDelete={handleDelete}
                  onOpenSource={() => navigate("/ocr-edit")}
                />
              </PanelInner>
            )}
          </PanelSlot>
        </Body>
      </Grid>
    </AppShell>
  );
};

