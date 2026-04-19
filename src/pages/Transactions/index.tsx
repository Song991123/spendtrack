import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { DatePill } from "../../components/primitives/DatePill";
import { media } from "../../tokens/breakpoints";
import { SummaryStrip } from "./components/SummaryStrip";
import { FilterBar } from "./components/FilterBar";
import { TransactionTable } from "./components/TransactionTable";
import { DetailPanel } from "./components/DetailPanel";
import { transactionsMockData } from "./data";

const Body = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  align-items: start;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div`
  display: grid;
  gap: 16px;
  min-width: 0;
`;

const Grid = styled.div`
  display: grid;
  gap: 16px;
`;

export const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(transactionsMockData.rows);
  const [selectedId, setSelectedId] = useState<string>(transactionsMockData.rows[0].id);

  const selected = useMemo(
    () => rows.find((row) => row.id === selectedId) ?? rows[0],
    [rows, selectedId]
  );

  const handleDelete = () => {
    setRows((current) => {
      const nextRows = current.filter((row) => row.id !== selectedId);
      if (nextRows.length > 0) {
        setSelectedId(nextRows[0].id);
      }
      return nextRows;
    });
  };

  return (
    <AppShell
      activeNav="transactions"
      crumb="거래 · 2025년 4월"
      title="수입·지출 내역"
      headerRight={<DatePill>2025년 4월</DatePill>}
    >
      <Grid>
        <SummaryStrip summary={transactionsMockData.summary} />
        <Body>
          <Left>
            <FilterBar totalLabel={transactionsMockData.summary.countLabel} />
            <TransactionTable rows={rows} selectedId={selectedId} onSelect={setSelectedId} />
          </Left>
          {selected && (
            <DetailPanel
              row={selected}
              onClose={() => setSelectedId(rows[0]?.id ?? selectedId)}
              onEdit={() => navigate("/manual-entry")}
              onDelete={handleDelete}
              onOpenSource={() => navigate("/ocr-edit")}
            />
          )}
        </Body>
      </Grid>
    </AppShell>
  );
};
