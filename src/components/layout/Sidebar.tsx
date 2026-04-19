/**
 * 역할: 여러 화면이 함께 사용하는 공통 레이아웃 컴포넌트입니다.
 * 위치: src\components\layout\Sidebar.tsx
 */
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import type { NavKey } from "./AppShell";
import { tokens } from "../../styles/tokens";
import { media } from "../../tokens/breakpoints";

interface SidebarProps {
  activeNav: NavKey;
  user: { name: string; initial: string };
}

const NAV_ITEMS: Array<{
  key: Exclude<NavKey, "settings">;
  label: string;
  path: string;
}> = [
  { key: "home", label: "홈", path: "/" },
  { key: "upload", label: "입력", path: "/upload" },
  { key: "transactions", label: "수입·지출 내역", path: "/transactions" },
  { key: "analysis", label: "소비 분석", path: "/analysis" },
];

const Aside = styled.aside`
  width: 232px;
  height: 100vh;
  padding: 18px 14px;
  background: ${tokens.color.panel};
  border-right: 1px solid ${tokens.color.line};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  overflow-y: auto;

  ${media.tablet} {
    width: 220px;
  }
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px 18px;
`;

const LogoMark = styled.div`
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  background: ${tokens.color.accent};
  border-radius: 8px;
  color: #fff;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
`;

const BrandText = styled.div`
  .name {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .sub {
    margin-top: -2px;
    color: ${tokens.color.ink4};
    font-size: 11px;
  }
`;

const Section = styled.div`
  padding: 14px 10px 6px;
  color: ${tokens.color.ink4};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 1px 0;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? tokens.color.accentSubtle : "transparent")};
  color: ${({ $active }) => ($active ? tokens.color.accentHover : tokens.color.ink2)};
  cursor: pointer;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 500;
  position: relative;
  text-align: left;

  &:hover {
    background: ${({ $active }) => ($active ? tokens.color.accentSubtle : tokens.color.tint)};
  }

  &::before {
    content: "";
    position: absolute;
    left: -14px;
    top: 6px;
    bottom: 6px;
    width: 3px;
    background: ${tokens.color.accent};
    border-radius: 0 3px 3px 0;
    display: ${({ $active }) => ($active ? "block" : "none")};
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding: 10px;
  border: 1px solid ${tokens.color.line};
  border-radius: 10px;
`;

const Avatar = styled.div`
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 50%;
  background: ${tokens.color.accent};
  color: #fff;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
`;

const UserMeta = styled.div`
  min-width: 0;

  .name {
    color: ${tokens.color.ink1};
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
  }

  .sub {
    color: ${tokens.color.ink4};
    font-size: 11px;
    line-height: 1.3;
  }
`;

const ActionButton = styled.button`
  margin-top: 1px;
  border: none;
  background: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  text-align: left;

  &:hover {
    color: ${tokens.color.ink3};
  }
`;

export const Sidebar = ({ activeNav, user }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <Aside>
      <LogoArea>
        <LogoMark>S</LogoMark>
        <BrandText>
          <div className="name">SpendTrack</div>
          <div className="sub">쇼핑 소비 관리</div>
        </BrandText>
      </LogoArea>

      <Section>메뉴</Section>
      <Nav>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.key}
            type="button"
            $active={activeNav === item.key}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </NavItem>
        ))}
      </Nav>

      <Section>계정</Section>
      <Nav>
        <NavItem
          type="button"
          $active={activeNav === "settings"}
          onClick={() => navigate("/settings")}
        >
          계정 설정
        </NavItem>
      </Nav>

      <Footer>
        <Avatar>{user.initial}</Avatar>
        <UserMeta>
          <div className="name">{user.name}</div>
          <div className="sub">hong@example.com</div>
          <div className="sub">
            <ActionButton type="button" onClick={() => navigate("/login")}>
              로그아웃
            </ActionButton>
          </div>
        </UserMeta>
      </Footer>
    </Aside>
  );
};

