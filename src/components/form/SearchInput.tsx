import styled from "styled-components";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  width: 100%;
`;

export default function SearchInput({
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <Input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}