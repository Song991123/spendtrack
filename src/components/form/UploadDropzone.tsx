import styled from "styled-components";

interface Props {
  onUpload: () => void;
}

const Box = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
`;

export default function UploadDropzone({ onUpload }: Props) {
  return <Box onClick={onUpload}>파일 업로드</Box>;
}