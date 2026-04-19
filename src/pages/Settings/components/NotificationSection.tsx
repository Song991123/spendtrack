import React, { useState } from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";
import { SettingsBlock } from "./SettingsSection";

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid ${tokens.color.line2};

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: ${tokens.color.ink1};
    font-size: 13px;
    font-weight: 600;
  }

  .sub {
    margin-top: 2px;
    color: ${tokens.color.ink4};
    font-size: 12px;
    line-height: 1.5;
  }
`;

const Toggle = styled.button<{ $on: boolean }>`
  position: relative;
  width: 40px;
  height: 22px;
  border: none;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? tokens.color.accent : tokens.color.line)};
  cursor: pointer;
  flex: none;
  transition: background 0.16s;

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? "21px" : "3px")};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.15);
    transition: left 0.16s;
  }
`;

interface Pref {
  key: string;
  label: string;
  desc: string;
  on: boolean;
}

const INIT: Pref[] = [
  {
    key: "monthly",
    label: "월간 지출 요약",
    desc: "매월 1일, 전월 지출·수입 요약을 이메일로 받아요.",
    on: true,
  },
  {
    key: "overspend",
    label: "예산 초과 경고",
    desc: "카테고리 예산을 80% 이상 사용하면 알려드려요.",
    on: true,
  },
  {
    key: "refund",
    label: "환불·취소 감지",
    desc: "환불이나 취소 내역이 감지되면 알림을 보내요.",
    on: false,
  },
  {
    key: "tips",
    label: "팁·업데이트 소식",
    desc: "새 기능 소식과 가계부 사용 팁을 받아볼게요.",
    on: false,
  },
];

export const NotificationSection: React.FC = () => {
  const [prefs, setPrefs] = useState(INIT);

  const toggle = (key: string) => {
    setPrefs((current) => current.map((pref) => (pref.key === key ? { ...pref, on: !pref.on } : pref)));
  };

  return (
    <SettingsBlock title="알림" subtitle="이메일로 받을 알림 종류를 선택하세요.">
      {prefs.map((pref) => (
        <Item key={pref.key}>
          <div>
            <div className="label">{pref.label}</div>
            <div className="sub">{pref.desc}</div>
          </div>
          <Toggle type="button" $on={pref.on} onClick={() => toggle(pref.key)} />
        </Item>
      ))}
    </SettingsBlock>
  );
};
