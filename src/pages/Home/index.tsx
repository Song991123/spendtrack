/**
 * 역할: 해당 화면의 상태와 레이아웃을 조립하는 페이지 진입 파일입니다.
 * 위치: src\pages\Home\index.tsx
 */
import React, { useMemo, useState } from "react";
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
import { buildHomeData } from "./data";
import { getMonthOption } from "../../constants/months";
import { useTransactionsStore } from "../../stores/transactionsStore";
// TODO(auth): 목업 로그인 분기를 걷어낼 때, 이 오버레이의 표시 조건도 실제 신규 가입 이벤트로 옮겨야 합니다.
import { WelcomeTutorial } from "../../components/onboarding/WelcomeTutorial";

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
  // 월을 바꾸면 같은 화면 구조 안에서 해당 월의 집계만 교체됩니다.
  // 거래 데이터는 transactionsStore에서 구독해 가져오고, 추가/삭제가 즉시 반영됩니다.
  const [month, setMonth] = useState("2026-04");
  const rows = useTransactionsStore();
  const data = useMemo(() => buildHomeData(rows, month), [rows, month]);
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
      {/*
        WelcomeTutorial은 최초 진입 시 localStorage 플래그(ONBOARDING_SEEN_KEY)가 없을 때만 자동으로 뜹니다.
        LoginForm의 목업 "1111/1111" 분기에서 이 플래그를 제거하기 때문에, 신규 계정으로 로그인한 직후
        Home에 들어오면 튜토리얼이 다시 보입니다.
      */}
      <WelcomeTutorial />
    </AppShell>
  );
};

