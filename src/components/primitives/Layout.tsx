import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

interface StackProps {
  gap?: number;
}

export const Stack = styled.div<StackProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => `${gap || 0}px`};
`;

interface GridProps {
  columns?: string;
  gap?: number;
}

export const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns || "1fr"};
  gap: ${({ gap }) => `${gap || 0}px`};
`;