/**
 * 역할: 특정 페이지 안에서만 사용하는 화면 전용 UI 블록입니다.
 * 위치: src\pages\OcrEdit\components\ImageList.tsx
 */
import React from "react";
import styled from "styled-components";
import { Card, CardBd, CardHd, CardTitle } from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";
import type { OcrImageItem } from "../data";

const List = styled.ul`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li<{ $active?: boolean }>`
  display: grid;
  /* 썸네일과 텍스트가 한 줄에 깔끔히 들어가도록 썸네일을 조금 줄이고
   * Meta 쪽에 최소 폭을 보장합니다. */
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  padding: 8px;
  border: 1px solid ${({ $active }) => ($active ? tokens.color.accentBorder : "transparent")};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? tokens.color.accentSubtle : "transparent")};
  cursor: pointer;
  transition: background ${tokens.motion.fast};

  &:hover {
    background: ${({ $active }) => ($active ? tokens.color.accentSubtle : tokens.color.tint)};
  }
`;

const Thumb = styled.div`
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  overflow: hidden;
  border: 1px solid ${tokens.color.line};
  border-radius: 6px;
  background: ${tokens.color.tint};
  color: ${tokens.color.ink5};
  font-size: 16px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Meta = styled.div`
  /* 좁은 컨테이너에서도 한 줄로 들어가게끔 넘치면 말줄임표로 처리합니다. */
  min-width: 0;

  .name {
    margin-bottom: 4px;
    color: ${tokens.color.ink1};
    font-size: ${tokens.type.caption.size};
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: ${tokens.color.ink4};
    font-size: 11px;
    white-space: nowrap;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .dot.on {
    background: ${tokens.color.accent};
  }

  .dot.off {
    background: ${tokens.color.ink5};
  }
`;

const AddButton = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  border: 1px dashed ${tokens.color.line};
  border-radius: 8px;
  background: ${tokens.color.panel};
  color: ${tokens.color.ink3};
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;

  &:hover {
    border-color: ${tokens.color.accent};
    color: ${tokens.color.accentHover};
  }
`;

export const ImageList: React.FC<{
  images: OcrImageItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}> = ({ images, selectedId, onSelect, onAdd }) => (
  <Card>
    <CardHd>
      <CardTitle>이미지 목록</CardTitle>
    </CardHd>
    <CardBd>
      <List>
        {images.map((image) => {
          const active = image.id === selectedId;
          return (
            <Row key={image.id} $active={active} onClick={() => onSelect(image.id)}>
              <Thumb>{image.thumbUrl ? <img src={image.thumbUrl} alt={image.fileName} /> : "🧾"}</Thumb>
              <Meta>
                <div className="name">{image.fileName}</div>
                <div className="status">
                  <span className={`dot ${image.status === "analyzed" ? "on" : "off"}`} />
                  {image.status === "analyzed" ? "분석 완료" : "대기 중"}
                </div>
              </Meta>
            </Row>
          );
        })}
      </List>
      <AddButton type="button" onClick={onAdd}>
        + 이미지 추가
      </AddButton>
    </CardBd>
  </Card>
);

