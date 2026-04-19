/**
 * 역할: 입력 흐름에서 재사용하는 폼 관련 공통 컴포넌트입니다.
 * 위치: src\components\form\UploadDropzone.tsx
 */
import styled from "styled-components";
import { tokens } from "../../styles/tokens";

interface Props {
  onUpload: () => void;
}

const Box = styled.div`
  border: 2px dashed ${tokens.color.line};
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
`;

export default function UploadDropzone({ onUpload }: Props) {
  return <Box onClick={onUpload}>파일 업로드</Box>;
}

