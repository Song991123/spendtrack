import type { ReactNode } from "react";
import styled from "styled-components";
import { Card } from "../primitives/Card";

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
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0;
`;

const Value = styled.strong`
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  line-height: 1.15;
  letter-spacing: -0.5px;
  margin-top: 2px;
`;

const Trend = styled.span<{ $direction: "up" | "down" | "flat" }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11.5px;
  font-weight: 500;
  margin-top: 2px;
  color: ${({ $direction }) =>
    $direction === "up"
      ? "#dc2626"
      : $direction === "down"
      ? "#16a34a"
      : "#6b7280"};
`;

const Footer = styled.span`
  font-size: 11.5px;
  color: #9ca3af;
  margin-top: 1px;
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