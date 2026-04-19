/**
 * 역할: 상태 표시, 미리보기, 요약 카드처럼 정보를 보여주는 공통 컴포넌트입니다.
 * 위치: src\components\display\ImagePreview.tsx
 */
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
