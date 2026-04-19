/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Settings\components\ProfileSection.tsx
 */
import React from "react";
import styled from "styled-components";
import { Button } from "../../../components/primitives/Button";
import { FormField } from "../../../components/form/FormField";
import { TextInput } from "../../../components/form/TextInput";
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

const FieldGrid = styled.div`
  display: grid;
  gap: 14px;
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
            제거
          </Button>
        </div>
      </Meta>
    </Row>
    <FieldGrid>
      <FormField label="이름">
        <TextInput defaultValue="홍길동" />
      </FormField>
      <FormField label="닉네임">
        <TextInput defaultValue="길동님" />
      </FormField>
    </FieldGrid>
    <Actions>
      <Button variant="primary" size="md">
        변경사항 저장
      </Button>
    </Actions>
  </SettingsBlock>
);

