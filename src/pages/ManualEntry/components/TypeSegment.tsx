import React from "react";
import { SegmentedControl } from "../../../components/primitives/SegmentedControl";

export type TxType = "expense" | "income";

const OPTIONS = [
  { value: "expense" as const, label: "지출" },
  { value: "income" as const, label: "수입" },
];

export const TypeSegment: React.FC<{ value: TxType; onChange: (value: TxType) => void }> = ({
  value,
  onChange,
}) => <SegmentedControl value={value} options={OPTIONS} onChange={onChange} />;
