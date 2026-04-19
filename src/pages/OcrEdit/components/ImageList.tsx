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
  grid-template-columns: 60px 1fr;
  gap: 10px;
  align-items: center;
  padding: 8px;
  border: 1px solid ${({ $active }) => ($active ? tokens.color.accentBorder : "transparent")};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? tokens.color.accentSubtle : "transparent")};
  cursor: pointer;
  transition: background 0.12s;

  &:hover {
    background: ${({ $active }) => ($active ? tokens.color.accentSubtle : tokens.color.tint)};
  }
`;

const Thumb = styled.div`
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
  overflow: hidden;
  border: 1px solid ${tokens.color.line};
  border-radius: 6px;
  background: ${tokens.color.tint};
  color: ${tokens.color.ink5};
  font-size: 18px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Meta = styled.div`
  .name {
    margin-bottom: 4px;
    color: ${tokens.color.ink1};
    font-size: 12.5px;
    font-weight: 600;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: ${tokens.color.ink4};
    font-size: 11px;
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
