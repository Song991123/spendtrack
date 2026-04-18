import styled from "styled-components";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  emptyPlaceholder?: string;
}

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export default function EditableFieldRow({
  label,
  value,
  onChange,
  emptyPlaceholder,
}: Props) {
  return (
    <Row>
      <label>{label}</label>
      <input
        value={value}
        placeholder={emptyPlaceholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Row>
  );
}