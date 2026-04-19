import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { tokens } from "../../styles/tokens";
import { media } from "../../tokens/breakpoints";

export type NavKey = "home" | "upload" | "transactions" | "analysis" | "settings";

interface AppShellProps {
  activeNav: NavKey;
  crumb?: string;
  title: string;
  headerRight?: ReactNode;
  children: ReactNode;
}

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
  padding: 20px 28px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;

  ${media.tablet} {
    padding: 20px 24px 40px;
  }

  ${media.mobile} {
    padding: 16px 16px 32px;
  }
`;

export const AppShell = ({ activeNav, crumb, title, headerRight, children }: AppShellProps) => {
  const navigate = useNavigate();

  return (
    <Shell>
      <SidebarWrapper>
        <Sidebar activeNav={activeNav} user={{ name: "홍길동", initial: "홍" }} />
      </SidebarWrapper>
      <Main>
        <Content>
          <TopHeader crumb={crumb} title={title} right={headerRight} />
          {children}
        </Content>
        <MobileNav>
          <MobileNavItem $active={activeNav === "home"} onClick={() => navigate("/")}>
            홈
          </MobileNavItem>
          <MobileNavItem $active={activeNav === "upload"} onClick={() => navigate("/upload")}>
            업로드
          </MobileNavItem>
          <MobileNavItem
            $active={activeNav === "transactions"}
            onClick={() => navigate("/transactions")}
          >
            내역
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
