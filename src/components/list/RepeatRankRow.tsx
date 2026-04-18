import type { RepeatProduct } from "../../types/product";
import { formatKRW } from "../../utils/format";
import ListRow from "./ListRow";

interface Props {
  item: RepeatProduct;
}

export default function RepeatRankRow({ item }: Props) {
  return (
    <ListRow>
      <div>
        <div>{item.name}</div>
        <small>
          {item.platform} · {item.category}
        </small>
      </div>
      <strong>{formatKRW(item.totalAmount)}</strong>
    </ListRow>
  );
}