/**
 * 역할: 해당 화면의 상태와 레이아웃을 조립하는 페이지 진입 파일입니다.
 *       거래 데이터는 transactionsStore(localStorage 기반)를 통해 읽고,
 *       월 단위 필터·검색·선택 상태를 화면 내부에서 관리합니다.
 * 위치: src\pages\Transactions\index.tsx
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { MonthPicker } from "../../components/primitives/MonthPicker";
import { tokens } from "../../styles/tokens";
import { media } from "../../tokens/breakpoints";
import { SummaryStrip } from "./components/SummaryStrip";
import { FilterBar } from "./components/FilterBar";
import { TransactionTable } from "./components/TransactionTable";
import { DetailPanel } from "./components/DetailPanel";
import { buildTransactionSummary, getPrevMonthKey } from "./data";
import { getMonthOption } from "../../constants/months";
import {
  transactionsStore,
  useTransactionsStore,
} from "../../stores/transactionsStore";
import { TransactionEditModal } from "../../components/modal/TransactionEditModal";
import { Modal } from "../../components/modal/Modal";
import type { TxRow } from "./components/TransactionTable";

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

function toMonthKey(dateStr: string): string {
  // "2026.04.19" → "2026-04" 형식으로 변환해 월 필터 키로 사용합니다.
  const match = dateStr.match(/(\d{4})[./-](\d{1,2})/);
  if (!match) return "";
  const [, year, month] = match;
  return `${year}-${month.padStart(2, "0")}`;
}

export const TransactionsPage: React.FC = () => {
  // 필터 상태는 모두 페이지 상단에서 관리해서 표와 상세 패널이 같은 기준을 보게 합니다.
  const [month, setMonth] = useState("2026-04");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "expense" | "income">("all");
  const [platform, setPlatform] = useState<"all" | "coupang" | "naver" | "musinsa" | "unspecified">("all");
  const [category, setCategory] = useState<"all" | "living" | "fashion" | "digital" | "food" | "etc">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "purchase" | "cancel" | "refund" | "sub" | "etc">("all");
  // 거래 내역은 기본적으로 최신이 위로 오게 두고, 사용자가 원하면 오름차순으로 뒤집을 수 있습니다.
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // 거래 원본은 스토어에서 구독해 가져옵니다. CSV 업로드·삭제 등 변경이 자동 반영됩니다.
  const allRows = useTransactionsStore();
  const monthRows = useMemo(
    () => allRows.filter((row) => toMonthKey(row.date) === month),
    [allRows, month]
  );
  const prevMonthRows = useMemo(() => {
    const prevKey = getPrevMonthKey(month);
    return allRows.filter((row) => toMonthKey(row.date) === prevKey);
  }, [allRows, month]);
  const monthOption = getMonthOption(month);

  const filteredRows = useMemo(() => {
    // 검색어, 플랫폼, 카테고리 조건을 한 번에 적용해 실제 표에 보여줄 후보 목록을 만듭니다.
    const query = search.trim().toLowerCase();

    const matched = monthRows.filter((row) => {
      if (typeFilter !== "all" && row.type !== typeFilter) {
        return false;
      }

      if (platform !== "all" && row.platform !== platform) {
        return false;
      }

      // 다중 카테고리 거래는 카테고리 중 하나라도 필터 키와 일치하면 표에 노출합니다.
      if (category !== "all" && !row.categories.includes(category)) {
        return false;
      }

      if (statusFilter !== "all" && row.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const itemText = row.detail?.items.map((item) => item.name).join(" ").toLowerCase() ?? "";
      return row.title.toLowerCase().includes(query) || itemText.includes(query);
    });

    // "YYYY.MM.DD" / "YYYY-MM-DD"를 수치로 환산해 정렬 기준을 만듭니다.
    const dayKey = (dateStr: string): number => {
      const parsed = dateStr.match(/(\d{4})[./-](\d{1,2})[./-](\d{1,2})/);
      if (!parsed) return 0;
      const [, y, m, d] = parsed;
      return Number(y) * 10000 + Number(m) * 100 + Number(d);
    };

    // 정렬은 filter 이후 한 번만 수행합니다. 기본은 desc(최신이 위).
    const sorted = [...matched].sort((a, b) => {
      const diff = dayKey(a.date) - dayKey(b.date);
      return sortOrder === "desc" ? -diff : diff;
    });
    return sorted;
  }, [category, monthRows, platform, search, sortOrder, statusFilter, typeFilter]);

  const INITIAL_VISIBLE = 20;
  const LOAD_STEP = 20;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [selectedId, setSelectedId] = useState<string>(monthRows[0]?.id ?? "");

  useEffect(() => {
    // 월이 바뀌면 선택과 가시 개수를 초기화합니다.
    setVisibleCount(INITIAL_VISIBLE);
    setSelectedId((current) =>
      monthRows.some((row) => row.id === current) ? current : monthRows[0]?.id ?? ""
    );
  }, [month, monthRows]);

  useEffect(() => {
    // 필터가 바뀌면 "더 보기" 개수도 처음 상태로 되돌려 다시 탐색하게 합니다.
    setVisibleCount(INITIAL_VISIBLE);
  }, [search, platform, category, typeFilter, statusFilter]);

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

    transactionsStore.removeOne(selected.id);
    setSelectedId(nextSelectedId);
  };

  // 수정 모달은 상세 패널에서 '수정하기'를 누르는 순간 열려, 대상 거래의 id와 현재 값을 그대로 받습니다.
  // 수동 입력 화면으로의 전체 페이지 이동 대신 해당 거래만 가볍게 편집할 수 있게 합니다.
  // editEpoch는 "같은 거래를 다시 열었을 때도 모달을 remount"시키기 위한 단조 증가 카운터입니다.
  // 모달 내부 상태는 row prop 기반 useState 초기자로만 세팅되므로, 새로 열릴 때마다
  // key를 바꿔 remount해야 편집 중이던 값이 남지 않습니다.
  const [editTarget, setEditTarget] = useState<TxRow | null>(null);
  const [editEpoch, setEditEpoch] = useState(0);

  const handleEditOpen = useCallback((row: TxRow) => {
    setEditTarget(row);
    setEditEpoch((current) => current + 1);
  }, []);

  const handleEditSave = useCallback((id: string, patch: Partial<TxRow>) => {
    transactionsStore.updateOne(id, patch);
  }, []);

  // OCR 경로로 저장된 거래에서 "원본 캡쳐만 다시 보기" 흐름을 위한 모달 상태입니다.
  // 이전에는 편집 페이지로 이동했지만, 이 거래는 이미 파싱된 상태라 재방문이 낭비였고
  // 이미지 한 장만 띄우는 가벼운 뷰로 역할을 좁혔습니다. URL이 비어 있는 경우도
  // 있어(mock/구데이터), 모달 본문에서 플레이스홀더로 떨어뜨립니다.
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);

  const handleOpenSource = useCallback(() => {
    if (!displayed) return;
    setSourceImageUrl(displayed.detail?.sourceImageUrl ?? "");
  }, [displayed]);

  return (
    <AppShell
      activeNav="transactions"
      crumb={`거래 · ${monthOption.label}`}
      title="수입·지출 내역"
      headerRight={<MonthPicker value={month} onChange={setMonth} />}
    >
      <Grid>
        <SummaryStrip summary={buildTransactionSummary(monthRows, prevMonthRows)} />
        <Body $hasPanel={isOpen}>
          <Left>
            {/* 왼쪽 영역은 필터와 표, 오른쪽 영역은 상세 패널로 역할을 분리합니다. */}
            <FilterBar
              search={search}
              typeFilter={typeFilter}
              platform={platform}
              category={category}
              statusFilter={statusFilter}
              onSearchChange={setSearch}
              onTypeChange={setTypeFilter}
              onPlatformChange={setPlatform}
              onCategoryChange={setCategory}
              onStatusChange={setStatusFilter}
            />
            <TransactionTable
              rows={visibleRows}
              totalCount={filteredRows.length}
              selectedId={selected?.id ?? ""}
              onSelect={setSelectedId}
              onLoadMore={handleLoadMore}
              sortOrder={sortOrder}
              onToggleSort={() =>
                setSortOrder((current) => (current === "desc" ? "asc" : "desc"))
              }
            />
          </Left>
          <PanelSlot>
            {displayed && (
              <PanelInner $open={isOpen}>
                <DetailPanel
                  row={displayed}
                  onClose={() => setSelectedId("")}
                  onEdit={() => handleEditOpen(displayed)}
                  onDelete={handleDelete}
                  onOpenSource={handleOpenSource}
                />
              </PanelInner>
            )}
          </PanelSlot>
        </Body>
      </Grid>
      {editTarget && (
        <TransactionEditModal
          key={editEpoch}
          row={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={handleEditSave}
        />
      )}
      {sourceImageUrl !== null && (
        <Modal
          isOpen
          onClose={() => setSourceImageUrl(null)}
          title="OCR 분석한 이미지"
        >
          {/* 이미지 URL이 비어 있는 경우(mock/구데이터)엔 플레이스홀더로 떨어뜨려,
            "버튼은 보이는데 눌러도 아무것도 안 뜬다"는 상태를 피합니다. */}
          {sourceImageUrl ? (
            <img
              src={sourceImageUrl}
              alt="OCR 분석에 사용된 원본 캡쳐"
              style={{
                display: "block",
                width: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: tokens.radius.control,
                background: tokens.color.bg,
              }}
            />
          ) : (
            <div
              style={{
                padding: "32px 0",
                textAlign: "center",
                color: tokens.color.ink4,
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              저장된 원본 이미지가 없어 표시할 수 없어요.
              <br />
              예전 데이터이거나 이미지가 유실된 경우일 수 있습니다.
            </div>
          )}
        </Modal>
      )}
    </AppShell>
  );
};
