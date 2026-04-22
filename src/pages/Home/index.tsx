/**
 * 역할: 해당 화면의 상태와 레이아웃을 조립하는 페이지 진입 파일입니다.
 * 위치: src\pages\Home\index.tsx
 */
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
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
  gap: 10px;
  min-width: 0;

  ${media.tablet} {
    /*
     * 태블릿부터는 오른쪽 영역이 좁아져서 날짜 스탬프 문구가 제멋대로 3~4줄로
     * 줄바꿈되는 문제가 있었습니다. MonthPicker 는 그대로 자연 폭으로 두고,
     * 스탬프는 그 옆에 한 줄로만 보이도록 min-width:0 과 nowrap 을 걸어 정리합니다.
     */
    width: 100%;
    justify-content: flex-start;
  }
`;

const DateStamp = styled.div`
  color: ${tokens.color.ink4};
  font-size: ${tokens.type.caption.size};
  font-weight: 500;
  /* 짧게 정리된 stamp("2026.04.20")가 한 줄로 보여야 '오늘과 같다'는 걸 한눈에 읽힙니다. */
  white-space: nowrap;
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

  // 로그인 분기에서 navigation state로 "튜토리얼 무조건 표시"를 요청받습니다.
  // 이 값을 한 번 캡처해 내부 state로 옮기고 즉시 history를 정리해서,
  // 뒤로가기/새로고침 시 같은 state가 반복 소비되어 튜토리얼이 재트리거되지 않게 합니다.
  const location = useLocation();
  const [forceTutorialOpen, setForceTutorialOpen] = useState<boolean>(
    () => Boolean((location.state as { showTutorial?: boolean } | null)?.showTutorial),
  );
  useEffect(() => {
    if (forceTutorialOpen) {
      // 현재 URL은 그대로 유지하되 state만 비워 "1회성 신호"로 처리합니다.
      try {
        window.history.replaceState({}, "", window.location.href);
      } catch {
        // SSR 등에서 접근이 불가하면 조용히 무시
      }
    }
  }, [forceTutorialOpen]);

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
        {/* data-tour: ProductTour 스포트라이트 타겟. 실제 인증으로 교체되더라도 유지해도 무해합니다. */}
        <div data-tour="home-kpi">
          <KpiStrip kpis={data.kpis} />
        </div>
        <Row2>
          <PlatformDonut total={data.platformDonut.total} items={data.platformDonut.items} />
          <TrendChart points={data.trend.points} />
        </Row2>
        <RecentTransactions items={data.recent} />
        <InsightCards items={data.insights} />
      </Grid>
      {/*
        WelcomeTutorial 표시 우선순위:
          1) LoginForm에서 `navigate("/", { state: { showTutorial: true } })`로 넘어왔다면
             forceTutorialOpen=true가 되어 **무조건** 뜹니다. (테스트 결정성 확보)
          2) 그 외 일반 진입에서는 컴포넌트 내부의 localStorage 플래그 로직이
             "최초 1회만 자동 표시"를 담당합니다.
        onClose에서 forceTutorialOpen을 내려주어, Home 내에서 페이지 이동 후 돌아와도
        닫힌 튜토리얼이 재오픈되지 않도록 합니다.
      */}
      <WelcomeTutorial
        forceOpen={forceTutorialOpen}
        onClose={() => setForceTutorialOpen(false)}
      />
    </AppShell>
  );
};

