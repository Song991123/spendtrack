import React from "react";
import styled from "styled-components";
import { Card, CardBd, CardHd, CardTitle } from "../../../components/primitives/Card";
import { tokens } from "../../../styles/tokens";
import type { UploadedImage } from "../data";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
`;

const Thumb = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid ${tokens.color.line};
  border-radius: 10px;
  background: ${tokens.color.tint};

  .placeholder {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: ${tokens.color.ink5};
    font-size: 24px;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Remove = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: rgba(11, 18, 32, 0.75);
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.12s;

  &:hover {
    background: rgba(11, 18, 32, 0.95);
  }
`;

const Meta = styled.div`
  margin-top: 6px;

  .name {
    overflow: hidden;
    color: ${tokens.color.ink2};
    font-size: 12px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .size {
    color: ${tokens.color.ink4};
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }
`;

export const UploadedGrid: React.FC<{
  images: UploadedImage[];
  onRemove: (id: string) => void;
}> = ({ images, onRemove }) => (
  <Card>
    <CardHd>
      <CardTitle>업로드된 이미지 ({images.length})</CardTitle>
    </CardHd>
    <CardBd>
      <Grid>
        {images.map((image) => (
          <div key={image.id}>
            <Thumb>
              {image.thumbUrl ? (
                <img src={image.thumbUrl} alt={image.fileName} />
              ) : (
                <div className="placeholder">□</div>
              )}
              <Remove type="button" onClick={() => onRemove(image.id)}>
                ×
              </Remove>
            </Thumb>
            <Meta>
              <div className="name">{image.fileName}</div>
              <div className="size">{image.sizeLabel}</div>
            </Meta>
          </div>
        ))}
      </Grid>
    </CardBd>
  </Card>
);
