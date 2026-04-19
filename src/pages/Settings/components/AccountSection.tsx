import React from "react";
import styled from "styled-components";
import { Button } from "../../../components/primitives/Button";
import { tokens } from "../../../styles/tokens";
import { SettingsBlock } from "./SettingsSection";

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  }
`;

export const AccountSection: React.FC = () => (
  <SettingsBlock title="계정" subtitle="이메일과 비밀번호를 관리해요.">
    <Item>
      <div>
        <div className="label">이메일</div>
        <div className="sub">hong@example.com</div>
      </div>
      <Button variant="ghost" size="sm">
        변경
      </Button>
    </Item>
    <Item>
      <div>
        <div className="label">비밀번호</div>
        <div className="sub">마지막 변경: 2025.02.10</div>
      </div>
      <Button variant="ghost" size="sm">
        변경
      </Button>
    </Item>
  </SettingsBlock>
);
