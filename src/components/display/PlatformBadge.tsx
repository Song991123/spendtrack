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