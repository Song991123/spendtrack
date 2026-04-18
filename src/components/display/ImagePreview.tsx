import styled from "styled-components";
import EmptyState from "./EmptyState";

interface Props {
  src?: string;
}

const Img = styled.img`
  width: 100%;
  border-radius: 12px;
`;

export default function ImagePreview({ src }: Props) {
  if (!src) {
    return <EmptyState title="이미지가 없습니다" />;
  }

  return <Img src={src} alt="preview" />;
}