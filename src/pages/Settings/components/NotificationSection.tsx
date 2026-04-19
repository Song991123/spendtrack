import React, { useState } from "react";
import styled from "styled-components";
import { Toggle } from "../../../components/primitives/Toggle";
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
    desc: "매월 1일, 지난달 지출과 수입 요약을 이메일로 받아요.",
    on: true,
  },
  {
    key: "overspend",
    label: "예산 초과 경고",
    desc: "카테고리 예산의 80% 이상을 사용하면 알려드려요.",
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
    label: "업데이트 소식",
    desc: "새 기능 소식과 가이드를 받을 수 있어요.",
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
          <Toggle checked={pref.on} onClick={() => toggle(pref.key)} />
        </Item>
      ))}
    </SettingsBlock>
  );
};
