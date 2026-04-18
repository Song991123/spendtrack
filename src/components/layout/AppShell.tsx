import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { media } from "../../tokens/breakpoints";

export type NavKey =
  | "home"
  | "upload"
  | "transactions"
  | "analysis"
  | "settings";

interface AppShellProps {
  activeNav: NavKey;
  title: string;
  headerRight?: ReactNode;
  children: ReactNode;
}

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  color: #111827;
  -webkit-font-smoothing: antialiased;

  ${media.mobile} {
    flex-direction: column;
  }
`;

const SidebarWrapper = styled.div`
  ${media.mobile} {
    display: none;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-y: auto;
`;

const MobileNav = styled.nav`
  display: none;

  ${media.mobile} {
    display: flex;
    gap: 16px;
    padding: 0 16px;
    height: 44px;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    background: #ffffff;
    overflow-x: auto;
  }
`;

const MobileNavItem = styled.button<{ $active?: boolean }>`
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? "#4F6EF7" : "#6B7280")};
  white-space: nowrap;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
`;

const MobileNavDivider = styled.div`
  width: 1px;
  height: 16px;
  background: #e5e7eb;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  padding: 24px 32px 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;

  ${media.tablet} {
    padding: 20px 24px 40px;
  }

  ${media.mobile} {
    padding: 16px 16px 32px;
  }
`;

export const AppShell = ({
  activeNav,
  title,
  headerRight,
  children,
}: AppShellProps) => {
  const navigate = useNavigate();

  return (
    <Shell>
      <SidebarWrapper>
        <Sidebar activeNav={activeNav} user={{ name: "홍길동", initial: "홍" }} />
      </SidebarWrapper>
      <Main>
        <TopHeader title={title} right={headerRight} />
        <MobileNav>
          <MobileNavItem $active={activeNav === "home"} onClick={() => navigate("/")}>
            홈
          </MobileNavItem>
          <MobileNavItem
            $active={activeNav === "upload"}
            onClick={() => navigate("/upload")}
          >
            업로드
          </MobileNavItem>
          <MobileNavItem
            $active={activeNav === "transactions"}
            onClick={() => navigate("/transactions")}
          >
            내역
          </MobileNavItem>
          <MobileNavItem
            $active={activeNav === "analysis"}
            onClick={() => navigate("/analysis")}
          >
            분석
          </MobileNavItem>
          <MobileNavItem
            $active={activeNav === "settings"}
            onClick={() => navigate("/settings")}
          >
            설정
          </MobileNavItem>
          <MobileNavDivider />
          <MobileNavItem type="button" onClick={() => navigate("/login")}>
            로그아웃
          </MobileNavItem>
        </MobileNav>
        <Content>{children}</Content>
      </Main>
    </Shell>
  );
};
