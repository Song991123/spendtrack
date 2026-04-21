/**
 * 역할: 해당 화면의 상태와 레이아웃을 조립하는 페이지 진입 파일입니다.
 * 위치: src\pages\Home\index.tsx
 */
import React, { useState } from "react";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { MonthPicker } from "../../components/primitives/MonthPicker";
import { tokens } from "../../styles/tokens";
import { media } from "../../tokens/breakpoints";
import { KpiStrip } from "./components/KpiStrip";
import { PlatformDonut } from "./components/PlatformDonut";
import { TrendChart } from "./components/TrendChart";
import { RecentTransactions } from "./components/RecentTransactions";
import { InsightCards } from "./components/InsightCards";
import { getHomeMockData } from "./data";
import { getMonthOption } from "../../constants/months";

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${media.mobile} {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

const DateStamp = styled.div`
  color: ${tokens.color.ink4};
  font-size: ${tokens.type.caption.size};
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
  // 월을 바꾸면 같은 화면 구조 안에서 해당 월의 목업 데이터만 교체됩니다.
  const [month, setMonth] = useState("2026-04");
  const data = getHomeMockData(month);
  const monthOption = getMonthOption(month);

  return (
    <AppShell
      activeNav="home"
      crumb={`대시보드 · ${monthOption.label}`}
      title="최신 소비 요약"
      headerRight={
        <HeaderRight>
          <MonthPicker value={month} onChange={setMonth} />
          <DateStamp>{monthOption.stamp}</DateStamp>
        </HeaderRight>
      }
    >
      <Grid>
        {/* Home은 상단 요약 → 차트 → 최근 거래 → 인사이트 순서로 읽히도록 구성합니다. */}
        <KpiStrip kpis={data.kpis} />
        <Row2>
          <PlatformDonut total={data.platformDonut.total} items={data.platformDonut.items} />
          <TrendChart points={data.trend.points} />
        </Row2>
        <RecentTransactions items={data.recent} />
        <InsightCards items={data.insights} />
      </Grid>
    </AppShell>
  );
};

