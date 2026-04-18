import styled from "styled-components";
import { PLATFORMS } from "../../types/platform";
import type { Platform } from "../../types/platform";

interface Props {
  value: Platform;
  onChange: (value: Platform) => void;
}

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
`;

export default function PlatformSelector({ value, onChange }: Props) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value as Platform)}>
      {PLATFORMS.map((platform) => (
        <option key={platform} value={platform}>
          {platform}
        </option>
      ))}
    </Select>
  );
}