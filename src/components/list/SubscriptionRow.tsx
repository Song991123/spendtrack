/**
 * 역할: 목록형 데이터를 한 줄 또는 한 블록 단위로 보여주는 공통 컴포넌트입니다.
 * 위치: src\components\list\SubscriptionRow.tsx
 */
import type { Subscription } from "../../types/purchase";
import { formatKRW } from "../../utils/format";
import ListRow from "./ListRow";

interface Props {
  item: Subscription;
}

export default function SubscriptionRow({ item }: Props) {
  return (
    <ListRow>
      <div>
        <div>{item.serviceName}</div>
        <small>{item.billingDate}</small>
      </div>
      <strong>{formatKRW(item.amount)}</strong>
    </ListRow>
  );
}
