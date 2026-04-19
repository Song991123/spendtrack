/**
 * 역할: 상태 표시, 미리보기, 요약 카드처럼 정보를 보여주는 공통 컴포넌트입니다.
 * 위치: src\components\display\PlatformBadge.tsx
 */
import styled from "styled-components";
import type { Platform } from "../../types/platform";
import { PLATFORM_COLORS } from "../../tokens/platforms";

interface Props {
  platform: Platform;
}

const Badge = styled.span<{ $bg: string; $fg: string; $border: string }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-size: 11px;
  border-radius: 999px;
  font-weight: 600;
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  border: 1px solid ${({ $border }) => $border};
`;

export default function PlatformBadge({ platform }: Props) {
  const color = PLATFORM_COLORS[platform];

  return (
    <Badge $bg={color.bg} $fg={color.fg} $border={color.border}>
      {platform}
    </Badge>
  );
}
