import React, { useState } from "react";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { tokens } from "../../styles/tokens";
import { media } from "../../tokens/breakpoints";
import { SummaryStrip } from "./components/SummaryStrip";
import { FilterBar } from "./components/FilterBar";
import { TransactionTable } from "./components/TransactionTable";
import { DetailPanel } from "./components/DetailPanel";
import { transactionsMockData } from "./data";

const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  align-items: start;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div`
  display: grid;
  gap: 16px;
`;

const DatePill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid ${tokens.color.line};
  background: ${tokens.color.panel};
  border-radius: 8px;
  color: ${tokens.color.ink2};
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${tokens.color.accent};
  }
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
      headerRight={
        <DatePill type="button">
          <span className="dot" />
          2025년 4월 ▼
        </DatePill>
      }
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
