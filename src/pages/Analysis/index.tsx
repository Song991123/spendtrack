/**
 * 역할: 해당 화면의 상태와 레이아웃을 조립하는 페이지 진입 파일입니다.
 * 위치: src\pages\Analysis\index.tsx
 */
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { AppShell } from "../../components/layout/AppShell";
import { MonthPicker } from "../../components/primitives/MonthPicker";
import { media } from "../../tokens/breakpoints";
import { SummaryBanner } from "./components/SummaryBanner";
import { KpiStrip } from "./components/KpiStrip";
import { PlatformBars } from "./components/PlatformBars";
import { CategoryBars } from "./components/CategoryBars";
import { RepeatTop3 } from "./components/RepeatTop3";
import { SubscriptionList } from "./components/SubscriptionList";
import { MonthlyTrend } from "./components/MonthlyTrend";
import { getAnalysisMockData } from "./data";
import { getMonthOption, LATEST_MONTH_KEY } from "../../constants/months";

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
  // Analysis도 월 선택만 바꾸면 같은 분석 레이아웃 안에서 데이터가 교체됩니다.
  const [month, setMonth] = useState("2026-04");
  const data = getAnalysisMockData(month);
  const monthOption = getMonthOption(month);

  const summaryTitle = useMemo(() => {
    // 최신 월은 "이번 달"로, 과거 월은 실제 라벨로 보여줘 문구를 자연스럽게 만듭니다.
    if (month === LATEST_MONTH_KEY) {
      return "이번 달 요약";
    }
    return `${monthOption.label} 요약`;
  }, [month, monthOption.label]);

  return (
    <AppShell
      activeNav="analysis"
      crumb={`분석 · ${monthOption.label}`}
      title="소비 분석"
      headerRight={<MonthPicker value={month} onChange={setMonth} />}
    >
      <Grid>
        {/* 요약 배너 이후 KPI와 세부 분석 카드들을 차례로 배치합니다. */}
        <SummaryBanner title={summaryTitle} text={data.summary} />
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

