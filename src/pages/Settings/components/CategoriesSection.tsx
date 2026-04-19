/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\Settings\components\CategoriesSection.tsx
 */
import React, { useState } from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";
import { SettingsBlock } from "./SettingsSection";

interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

const INIT: Category[] = [
  { id: "c1", name: "패션/의류", color: "#6366F1", count: 24 },
  { id: "c2", name: "생활비", color: "#10B981", count: 47 },
  { id: "c3", name: "카페/음료", color: "#F59E0B", count: 18 },
  { id: "c4", name: "전자제품", color: "#0EA5E9", count: 6 },
  { id: "c5", name: "교통비", color: "#EF4444", count: 31 },
];

const List = styled.div`
  display: grid;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 14px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${tokens.color.line2};

  &:last-of-type {
    border-bottom: none;
  }
`;

const Dot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
`;

const Name = styled.span`
  color: ${tokens.color.ink1};
  font-size: 13px;
  font-weight: 500;
`;

const Count = styled.span`
  color: ${tokens.color.ink4};
  font-size: 11.5px;
`;

export const CategoriesSection: React.FC = () => {
  const [categories] = useState(INIT);

  return (
    <SettingsBlock
      title="카테고리"
      subtitle="지출과 수입을 구분하는 카테고리 목록이에요. 색상은 리포트와 차트에 반영돼요."
    >
      <List>
        {categories.map((category) => (
          <Row key={category.id}>
            <Dot $color={category.color} />
            <Name>{category.name}</Name>
            <Count>{category.count}건</Count>
          </Row>
        ))}
      </List>
    </SettingsBlock>
  );
};

