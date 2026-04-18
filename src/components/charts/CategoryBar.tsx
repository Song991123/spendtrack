import styled from "styled-components";

interface Props {
  percent: number;
}

const Wrap = styled.div`
  width: 100%;
  height: 8px;
  background: #f3f4f6;
`;

const Fill = styled.div<{ $percent: number }>`
  height: 100%;
  background: #2563eb;
  width: ${({ $percent }) => `${Math.max(0, Math.min(100, $percent))}%`};
`;

export default function CategoryBar({ percent }: Props) {
  return (
    <Wrap>
      <Fill $percent={percent} />
    </Wrap>
  );
}