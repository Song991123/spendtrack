import React from "react";
import styled from "styled-components";
import { tokens } from "../../../styles/tokens";

const Zone = styled.div`
  padding: 40px 24px;
  background: ${tokens.color.foot};
  border: 1.5px dashed ${tokens.color.line};
  border-radius: ${tokens.radius.card};
  text-align: center;
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s;

  &:hover {
    border-color: ${tokens.color.accent};
    background: ${tokens.color.accentSubtle};
  }
`;

const IconBox = styled.div`
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: ${tokens.color.accentSubtle};
  color: ${tokens.color.accent};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Title = styled.div`
  margin-bottom: 4px;
  color: ${tokens.color.ink1};
  font-size: 14px;
  font-weight: 600;
`;

const Sub = styled.div`
  margin-bottom: 16px;
  color: ${tokens.color.ink4};
  font-size: 11.5px;
`;

const PickButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: ${tokens.color.accent};
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  &:hover {
    background: ${tokens.color.accentHover};
  }
`;

const UpIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const UploadZone: React.FC<{
  acceptedTypes: string;
  maxSize: string;
  maxCount: number;
}> = ({ acceptedTypes, maxSize, maxCount }) => (
  <Zone>
    <IconBox>
      <UpIcon />
    </IconBox>
    <Title>여러 장의 주문내역 캡처를 한 번에 업로드하세요</Title>
    <Sub>
      {acceptedTypes} · 최대 {maxSize} · 한 번에 {maxCount}장까지 동시 분석
    </Sub>
    <PickButton type="button">파일 선택하기</PickButton>
  </Zone>
);
