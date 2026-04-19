import React from "react";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { DatePill } from "../../components/primitives/DatePill";
import { tokens } from "../../styles/tokens";
import { media } from "../../tokens/breakpoints";
import { KpiStrip } from "./components/KpiStrip";
import { PlatformDonut } from "./components/PlatformDonut";
import { TrendChart } from "./components/TrendChart";
import { RecentTransactions } from "./components/RecentTransactions";
import { InsightCards } from "./components/InsightCards";
import { homeMockData } from "./data";

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${media.mobile} {
    width: 100%;
    justify-content: space-between;
  }
`;

const DateStamp = styled.div`
  color: ${tokens.color.ink4};
  font-size: 12px;
  font-weight: 500;
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

export const HomePage: React.FC = () => {
  const data = homeMockData;

  return (
    <AppShell
      activeNav="home"
      crumb="대시보드 · 2025년 4월"
      title="이번 달 소비 요약"
      headerRight={
        <HeaderRight>
          <DatePill>2025년 4월</DatePill>
          <DateStamp>2025년 4월 15일 화요일</DateStamp>
        </HeaderRight>
      }
    >
      <Grid>
        <KpiStrip kpis={data.kpis} />
        <Row2>
          <PlatformDonut total={data.platformDonut.total} items={data.platformDonut.items} />
          <TrendChart points={data.trend.points} average={data.trend.average} />
        </Row2>
        <RecentTransactions items={data.recent} />
        <InsightCards items={data.insights} />
      </Grid>
    </AppShell>
  );
};
