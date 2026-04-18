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