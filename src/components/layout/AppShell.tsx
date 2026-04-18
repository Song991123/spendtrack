import type { ReactNode } from "react";
import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";

export type NavKey = "home" | "upload" | "transactions" | "analysis";

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
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-y: auto;
`;

const Content = styled.div`
  flex: 1;
  padding: 24px 32px 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1280px;
  width: 100%;
`;

export const AppShell = ({
  activeNav,
  title,
  headerRight,
  children,
}: AppShellProps) => (
  <Shell>
    <Sidebar activeNav={activeNav} user={{ name: "홍민수", initial: "홍" }} />
    <Main>
      <TopHeader title={title} right={headerRight} />
      <Content>{children}</Content>
    </Main>
  </Shell>
);
