import styled from "styled-components";
import type { NavKey } from "./AppShell";

interface SidebarProps {
  activeNav: NavKey;
  user: { name: string; initial: string };
  onNavChange?: (key: NavKey) => void;
}

const NAV_ITEMS: { key: NavKey; label: string }[] = [
  { key: "home", label: "홈" },
  { key: "upload", label: "업로드" },
  { key: "transactions", label: "소비내역" },
  { key: "analysis", label: "소비분석" },
];

const Aside = styled.aside`
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
`;

const LogoArea = styled.div`
  padding: 20px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #e5e7eb;
`;

const LogoMark = styled.div`
  width: 28px;
  height: 28px;
  background: #3b82f6;
  border-radius: 7px;
  flex-shrink: 0;
`;

const LogoText = styled.span`
  font-weight: 700;
  font-size: 15px;
  color: #111827;
  letter-spacing: -0.2px;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  height: 38px;
  padding: 0 14px;
  border: none;
  background: ${({ $active }) => ($active ? "#eef4ff" : "transparent")};
  color: ${({ $active }) => ($active ? "#2563eb" : "#4b5563")};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  font-family: inherit;
  font-size: 13.5px;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: ${({ $active }) => ($active ? "#eef4ff" : "#f3f4f6")};
    color: ${({ $active }) => ($active ? "#2563eb" : "#111827")};
  }
`;

const Footer = styled.div`
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: #3b82f6;
  color: #ffffff;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  .name {
    font-weight: 600;
    font-size: 13px;
    color: #111827;
    line-height: 1.3;
  }
  .sub {
    font-size: 11px;
    color: #9ca3af;
    line-height: 1.3;
  }
`;

export const Sidebar = ({ activeNav, user, onNavChange }: SidebarProps) => (
  <Aside>
    <LogoArea>
      <LogoMark />
      <LogoText>SpendTrack</LogoText>
    </LogoArea>

    <Nav>
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.key}
          type="button"
          $active={activeNav === item.key}
          onClick={() => onNavChange?.(item.key)}
        >
          {item.label}
        </NavItem>
      ))}
    </Nav>

    <Footer>
      <Avatar>{user.initial}</Avatar>
      <UserMeta>
        <span className="name">{user.name}</span>
        <span className="sub">내 계정 설정</span>
      </UserMeta>
    </Footer>
  </Aside>
);