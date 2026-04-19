import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "../../../components/primitives/Button";
import { tokens } from "../../../styles/tokens";
import type { ManualProduct } from "./ProductRows";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  background: rgba(11, 18, 32, 0.4);
`;

const Modal = styled.div`
  width: 420px;
  max-width: calc(100vw - 32px);
  padding: 24px;
  background: ${tokens.color.panel};
  border-radius: ${tokens.radius.modal};
  box-shadow: ${tokens.shadow.modal};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .title {
    color: ${tokens.color.ink1};
    font-size: 16px;
    font-weight: 700;
  }

  .close {
    border: none;
    background: none;
    color: ${tokens.color.ink4};
    cursor: pointer;
    font-size: 18px;
  }
`;

const Field = styled.div`
  margin-bottom: 14px;

  label {
    display: block;
    margin-bottom: 6px;
    color: ${tokens.color.ink2};
    font-size: 12px;
    font-weight: 600;
  }

  input {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid ${tokens.color.line};
    border-radius: 8px;
    background: ${tokens.color.panel};
    font-family: inherit;
    font-size: 13.5px;
    outline: none;
  }

  input:focus {
    border-color: ${tokens.color.accent};
    box-shadow: ${tokens.shadow.focus};
  }

  input::placeholder {
    color: ${tokens.color.ink5};
  }
`;

const Hint = styled.div`
  margin-top: 12px;
  color: ${tokens.color.ink4};
  text-align: center;
  font-size: 11.5px;
`;

export const AddProductModal: React.FC<{
  onClose: () => void;
  onSubmit: (product: Omit<ManualProduct, "id">) => void;
}> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");

  const submit = () => {
    if (!name.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      price: Number(price.replace(/[^\d]/g, "")) || 0,
      link: link.trim() || undefined,
    });
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <Header>
          <span className="title">상품 추가</span>
          <button className="close" type="button" onClick={onClose}>
            ×
          </button>
        </Header>
        <Field>
          <label>상품명 *</label>
          <input
            placeholder="예: 나이키 에어포스 1 로우"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>
        <Field>
          <label>상품금액 *</label>
          <input
            placeholder="₩ 0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </Field>
        <Field>
          <label>상품링크 (선택)</label>
          <input
            placeholder="상품 URL을 입력하거나 비워두세요"
            value={link}
            onChange={(event) => setLink(event.target.value)}
          />
        </Field>
        <Button variant="primary" size="lg" block onClick={submit}>
          상품 추가하기
        </Button>
        <Hint>링크는 나중에 추가하거나 수정할 수 있어요.</Hint>
      </Modal>
    </Overlay>
  );
};
