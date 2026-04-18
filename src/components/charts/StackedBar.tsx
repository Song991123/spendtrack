import styled from "styled-components";

interface Segment {
  label: string;
  percent: number;
  color: string;
}

interface StackedBarProps {
  height?: number;
  segments: Segment[];
}

const Bar = styled.div<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => `${$height}px`};
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  display: flex;
`;

const Fill = styled.div<{ $percent: number; $color: string }>`
  width: ${({ $percent }) => `${$percent}%`};
  background: ${({ $color }) => $color};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
`;

export default function StackedBar({
  height = 34,
  segments,
}: StackedBarProps) {
  return (
    <Bar $height={height}>
      {segments.map((seg) => (
        <Fill
          key={seg.label}
          $percent={seg.percent}
          $color={seg.color}
          title={`${seg.label} ${seg.percent}%`}
        >
          {seg.label}
        </Fill>
      ))}
    </Bar>
  );
}