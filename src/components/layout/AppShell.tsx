/**
 * 역할: 여러 화면이 함께 사용하는 공통 레이아웃 컴포넌트입니다.
 * 위치: src\components\layout\AppShell.tsx
 */
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { tokens } from "../../styles/tokens";
import { media } from "../../tokens/breakpoints";
import { useProfile } from "../../stores/profileStore";

export type NavKey = "home" | "upload" | "transactions" | "analysis" | "settings";

interface AppShellProps {
  activeNav: NavKey;
  crumb?: string;
  title: string;
  headerRight?: ReactNode;
  children: ReactNode;
}

// 데스크톱에서는 좌측 사이드바와 본문 2단 구조를 사용합니다.
const Shell = styled.div`
  display: grid;
  grid-template-columns: 232px minmax(0, 1fr);
  min-height: 100vh;
  background: ${tokens.color.bg};

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const SidebarWrapper = styled.div`
  ${media.mobile} {
    display: none;
  }
`;

const Main = styled.main`
  min-width: 0;
  width: 100%;
`;

// 모바일에서는 사이드바 대신 가벼운 텍스트 네비게이션을 따로 보여 줍니다.
const MobileNav = styled.nav`
  display: none;

  ${media.mobile} {
    display: flex;
    gap: 16px;
    align-items: center;
    height: 44px;
    padding: 0 16px;
    background: ${tokens.color.panel};
    border-bottom: 1px solid ${tokens.color.line};
    overflow-x: auto;
  }
`;

const MobileNavItem = styled.button<{ $active?: boolean }>`
  border: none;
  background: none;
  padding: 0;
  color: ${({ $active }) => ($active ? tokens.color.accentHover : tokens.color.ink4)};
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  white-space: nowrap;
`;

const MobileNavDivider = styled.div`
  width: 1px;
  height: 16px;
  background: ${tokens.color.line};
  flex-shrink: 0;
`;

const Content = styled.div`
  width: 100%;
  min-width: 0;
  padding: 24px 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;

  ${media.tablet} {
    padding: 20px 24px 28px;
  }

  ${media.mobile} {
    padding: 16px 16px 24px;
  }
`;

export const AppShell = ({ activeNav, crumb, title, headerRight, children }: AppShellProps) => {
  const navigate = useNavigate();
  const profile = useProfile();
  const initial = profile.name.trim().charAt(0) || "?";

  return (
    <Shell>
      <SidebarWrapper>
        <Sidebar
          activeNav={activeNav}
          user={{
            name: profile.name,
            initial,
            email: profile.email,
            avatarDataUrl: profile.avatarDataUrl,
          }}
        />
      </SidebarWrapper>
      <Main>
        <Content>
          {/* 모든 화면이 같은 헤더 패턴을 공유하도록 셸에서 먼저 감쌉니다. */}
          <TopHeader crumb={crumb} title={title} right={headerRight} />
          {children}
        </Content>
        <MobileNav>
          {/* 모바일에서는 핵심 메뉴만 짧은 라벨로 유지해 화면 폭을 아낍니다. */}
          <MobileNavItem $active={activeNav === "home"} onClick={() => navigate("/")}>
            홈
          </MobileNavItem>
          <MobileNavItem $active={activeNav === "upload"} onClick={() => navigate("/upload")}>
            입력
          </MobileNavItem>
          <MobileNavItem
            $active={activeNav === "transactions"}
            onClick={() => navigate("/transactions")}
          >
            거래
          </MobileNavItem>
          <MobileNavItem $active={activeNav === "analysis"} onClick={() => navigate("/analysis")}>
            분석
          </MobileNavItem>
          <MobileNavItem $active={activeNav === "settings"} onClick={() => navigate("/settings")}>
            설정
          </MobileNavItem>
          <MobileNavDivider />
          <MobileNavItem type="button" onClick={() => navigate("/login")}>
            로그아웃
          </MobileNavItem>
        </MobileNav>
      </Main>
    </Shell>
  );
};

