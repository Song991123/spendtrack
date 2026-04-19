/**
 * 역할: 목록형 데이터를 한 줄 또는 한 블록 단위로 보여주는 공통 컴포넌트입니다.
 * 위치: src\components\list\RepeatRankRow.tsx
 */
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
