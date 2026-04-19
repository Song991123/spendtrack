import React from "react";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { tokens } from "../../styles/tokens";
import { media } from "../../tokens/breakpoints";
import { SummaryBanner } from "./components/SummaryBanner";
import { KpiStrip } from "./components/KpiStrip";
import { PlatformBars } from "./components/PlatformBars";
import { CategoryBars } from "./components/CategoryBars";
import { RepeatTop3 } from "./components/RepeatTop3";
import { SubscriptionList } from "./components/SubscriptionList";
import { MonthlyTrend } from "./components/MonthlyTrend";
import { analysisMockData } from "./data";

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

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const AnalysisPage: React.FC = () => {
  const data = analysisMockData;

  return (
    <AppShell
      activeNav="analysis"
      crumb="분석 · 2025년 4월"
      title="소비 분석"
      headerRight={
        <DatePill type="button">
          <span className="dot" />
          2025년 4월 ▼
        </DatePill>
      }
    >
      <Grid>
        <SummaryBanner text={data.summary} />
        <KpiStrip kpis={data.kpis} />
        <Row2>
          <PlatformBars
            items={data.platform.items}
            totalSpend={data.platform.totalSpend}
            totalIncome={data.platform.totalIncome}
            netSpend={data.platform.netSpend}
          />
          <CategoryBars items={data.category} />
        </Row2>
        <Row2>
          <RepeatTop3 items={data.repeat} />
          <SubscriptionList items={data.subscriptions} total={data.subscriptionTotal} />
        </Row2>
        <MonthlyTrend points={data.trend.points} average={data.trend.average} />
      </Grid>
    </AppShell>
  );
};
