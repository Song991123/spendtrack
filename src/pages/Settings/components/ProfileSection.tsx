import React from "react";
import styled from "styled-components";
import { Button } from "../../../components/primitives/Button";
import { tokens } from "../../../styles/tokens";
import { SettingsBlock } from "./SettingsSection";

const Row = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 20px;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${tokens.color.line2};
`;

const Avatar = styled.div`
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  border-radius: 50%;
  background: ${tokens.color.accent};
  color: #fff;
  font-size: 26px;
  font-weight: 700;
`;

const Meta = styled.div`
  .name {
    color: ${tokens.color.ink1};
    font-size: 15px;
    font-weight: 700;
  }

  .email {
    margin-top: 2px;
    color: ${tokens.color.ink4};
    font-size: 12.5px;
  }

  .actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
`;

const Field = styled.div`
  margin-bottom: 14px;

  label {
    display: block;
    margin-bottom: 6px;
    color: ${tokens.color.ink2};
    font-size: 12px;
    font-weight: 600;
  }

  input {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid ${tokens.color.line};
    border-radius: 8px;
    background: ${tokens.color.panel};
    color: ${tokens.color.ink1};
    font-family: inherit;
    font-size: 13.5px;
    outline: none;
  }

  input:focus {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
`;

export const ProfileSection: React.FC = () => (
  <SettingsBlock title="프로필" subtitle="이름과 사진을 변경할 수 있어요.">
    <Row>
      <Avatar>홍</Avatar>
      <Meta>
        <div className="name">홍길동</div>
        <div className="email">hong@example.com</div>
        <div className="actions">
          <Button variant="ghost" size="sm">
            사진 변경
          </Button>
          <Button variant="ghost" size="sm">
            삭제
          </Button>
        </div>
      </Meta>
    </Row>
    <Field>
      <label>이름</label>
      <input defaultValue="홍길동" />
    </Field>
    <Field>
      <label>닉네임</label>
      <input defaultValue="길동이" />
    </Field>
    <Actions>
      <Button variant="primary" size="md">
        변경사항 저장
      </Button>
    </Actions>
  </SettingsBlock>
);
