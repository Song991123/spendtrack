import styled from "styled-components";

interface Props {
  value: number;
  max: number;
}

const Bar = styled.div`
  width: 100%;
  height: 8px;
  background: #f3f4f6;
`;

const Fill = styled.div<{ $width: number }>`
  height: 100%;
  background: #111827;
  width: ${({ $width }) => `${$width}%`};
`;

export default function HorizontalBar({ value, max }: Props) {
  const width = max === 0 ? 0 : (value / max) * 100;

  return (
    <Bar>
      <Fill $width={width} />
    </Bar>
  );
}