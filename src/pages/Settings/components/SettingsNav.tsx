/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Settings\components\SettingsNav.tsx
 */
import React from "react";
import styled from "styled-components";
import { Card } from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";

export type SettingsSection = "profile" | "account" | "categories" | "danger";

const ITEMS: { key: SettingsSection; label: string }[] = [
  { key: "profile", label: "프로필" },
  { key: "account", label: "계정" },
  { key: "categories", label: "카테고리" },
  { key: "danger", label: "계정 삭제" },
];

const Wrap = styled(Card)`
  padding: 8px;
`;

const Item = styled.button<{ $on?: boolean; $danger?: boolean }>`
  display: block;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: ${({ $on }) => ($on ? tokens.color.accentSubtle : "transparent")};
  color: ${({ $on, $danger }) =>
    $on ? tokens.color.accentHover : $danger ? tokens.color.neg : tokens.color.ink2};
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: ${({ $on }) => ($on ? 600 : 500)};
  text-align: left;
  transition: background ${tokens.motion.fast};

  & + & {
    margin-top: 2px;
  }

  &:hover {
    background: ${({ $on }) => ($on ? tokens.color.accentSubtle : tokens.color.tint)};
  }
`;

export const SettingsNav: React.FC<{
  value: SettingsSection;
  onChange: (value: SettingsSection) => void;
}> = ({ value, onChange }) => (
  <Wrap>
    {ITEMS.map((item) => (
      <Item
        key={item.key}
        type="button"
        $on={value === item.key}
        $danger={item.key === "danger"}
        onClick={() => onChange(item.key)}
      >
        {item.label}
      </Item>
    ))}
  </Wrap>
);

