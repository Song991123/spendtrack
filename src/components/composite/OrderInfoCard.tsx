/**
 * 역할: 여러 primitive를 조합해 만든 중간 수준의 복합 컴포넌트입니다.
 * 위치: src\components\composite\OrderInfoCard.tsx
 */
import { Card } from "../primitives/Card";
import PlatformBadge from "../display/PlatformBadge";
import type { Platform } from "../../types/platform";
import { formatKRW } from "../../utils/format";

interface Props {
  title: string;
  platform: Platform;
  amount: number;
}

export default function OrderInfoCard({ title, platform, amount }: Props) {
  return (
    <Card>
      <h4>{title}</h4>
      <PlatformBadge platform={platform} />
      <p>{formatKRW(amount)}</p>
    </Card>
  );
}
