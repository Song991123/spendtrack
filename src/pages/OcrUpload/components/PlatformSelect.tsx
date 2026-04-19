import React from "react";
import styled from "styled-components";
import { Card, CardBd, CardHd, CardTitle } from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";
import { PLATFORM_LABELS } from "../../../constants/labels";

export type Platform = "coupang" | "naver" | "musinsa";

const Group = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Option = styled.button<{ $on?: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${({ $on }) => ($on ? tokens.color.accentBorder : tokens.color.line)};
  border-radius: 8px;
  background: ${({ $on }) => ($on ? tokens.color.accentSubtle : tokens.color.panel)};
  color: ${({ $on }) => ($on ? tokens.color.accentHover : tokens.color.ink2)};
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.12s;

  &:hover {
    background: ${({ $on }) => ($on ? tokens.color.accentSubtle : tokens.color.tint)};
  }
`;

export const PlatformSelect: React.FC<{
  value: Platform;
  onChange: (value: Platform) => void;
}> = ({ value, onChange }) => (
  <Card>
    <CardHd>
      <CardTitle>플랫폼 선택</CardTitle>
    </CardHd>
    <CardBd>
      <Group>
        {(Object.keys(PLATFORM_LABELS) as Platform[]).map((platform) => (
          <Option
            key={platform}
            type="button"
            $on={value === platform}
            onClick={() => onChange(platform)}
          >
            {PLATFORM_LABELS[platform]}
          </Option>
        ))}
      </Group>
    </CardBd>
  </Card>
);
