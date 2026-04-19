/**
 * 역할: 상태 표시, 미리보기, 요약 카드처럼 정보를 보여주는 공통 컴포넌트입니다.
 * 위치: src\components\display\StatCard.tsx
 */
import type { ReactNode } from "react";
import styled from "styled-components";
import { Card } from "../primitives/Card";
import { tokens } from "../../styles/tokens";

interface StatCardProps {
  label: string;
  value: string;
  trend?: { delta: number; period?: string };
  dot?: { color: string };
  footer?: ReactNode;
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const Dot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const Label = styled.span`
  font-size: ${tokens.type.caption.size};
  color: ${tokens.color.ink3};
  font-weight: 500;
  letter-spacing: 0;
`;

const Value = styled.strong`
  font-size: ${tokens.type.metric.size};
  font-weight: ${tokens.type.metric.weight};
  color: ${tokens.color.ink1};
  line-height: 1.15;
  letter-spacing: ${tokens.type.metric.tracking};
  margin-top: ${tokens.space[1]};
`;

const Trend = styled.span<{ $direction: "up" | "down" | "flat" }>`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.space[1]};
  font-size: ${tokens.type.caption.size};
  font-weight: 500;
  margin-top: ${tokens.space[1]};
  color: ${({ $direction }) =>
    $direction === "up"
      ? tokens.color.neg
      : $direction === "down"
      ? tokens.color.pos
      : tokens.color.ink3};
`;

const Footer = styled.span`
  font-size: ${tokens.type.caption.size};
  color: ${tokens.color.ink4};
  margin-top: ${tokens.space[1]};
`;

export const StatCard = ({
  label,
  value,
  trend,
  dot,
  footer,
}: StatCardProps) => {
  const direction: "up" | "down" | "flat" =
    !trend || trend.delta === 0 ? "flat" : trend.delta > 0 ? "up" : "down";

  const arrow =
    direction === "up" ? "▲" : direction === "down" ? "▼" : "–";
  const sign = trend && trend.delta > 0 ? "+" : "";

  return (
    <Card padding={22}>
      <Body>
        <LabelRow>
          {dot && <Dot $color={dot.color} />}
          <Label>{label}</Label>
        </LabelRow>
        <Value>{value}</Value>
        {trend && (
          <Trend $direction={direction}>
            <span>{arrow}</span>
            {trend.period ?? "전월 대비"} {sign}
            {trend.delta}%
          </Trend>
        )}
        {footer && <Footer>{footer}</Footer>}
      </Body>
    </Card>
  );
};

