import React, { useState } from "react";
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
  const data = transactionsMockData;
  const [selectedId, setSelectedId] = useState<string>(data.rows[0].id);
  const selected = data.rows.find((row) => row.id === selectedId) ?? data.rows[0];

  return (
    <AppShell
      activeNav="transactions"
      crumb="거래 · 2025년 4월"
      title="수입·지출 내역"
      headerRight={<DatePill>2025년 4월</DatePill>}
    >
      <Grid>
        <SummaryStrip summary={data.summary} />
        <Body>
          <Left>
            <FilterBar totalLabel={data.summary.countLabel} />
            <TransactionTable rows={data.rows} selectedId={selectedId} onSelect={setSelectedId} />
          </Left>
          <DetailPanel row={selected} onClose={() => undefined} />
        </Body>
      </Grid>
    </AppShell>
  );
};
