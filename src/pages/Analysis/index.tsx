import React from "react";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { DatePill } from "../../components/primitives/DatePill";
import { media } from "../../tokens/breakpoints";
import { SummaryBanner } from "./components/SummaryBanner";
import { KpiStrip } from "./components/KpiStrip";
import { PlatformBars } from "./components/PlatformBars";
import { CategoryBars } from "./components/CategoryBars";
import { RepeatTop3 } from "./components/RepeatTop3";
import { SubscriptionList } from "./components/SubscriptionList";
import { MonthlyTrend } from "./components/MonthlyTrend";
import { analysisMockData } from "./data";

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
      headerRight={<DatePill>2025년 4월</DatePill>}
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
