import { useState } from "react";
import styled from "styled-components";
import { Button } from "../primitives/Button";
import { FormField } from "../form/FormField";
import { TextInput } from "../form/TextInput";
import { Modal } from "./Modal";
import { parsePrice } from "../../utils/format";

interface ProductAddPayload {
  name: string;
  price: number;
  link?: string;
}

interface ProductAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: ProductAddPayload) => void;
}

const BodyStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ProductAddModal = ({ isOpen, onClose, onAdd }: ProductAddModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");

  const resetFields = () => {
    setName("");
    setPrice("");
    setLink("");
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  const handleAdd = () => {
    const trimmedName = name.trim();
    const parsedPrice = parsePrice(price);
    const trimmedLink = link.trim();

    if (!trimmedName || parsedPrice === 0) {
      return;
    }

    onAdd({
      name: trimmedName,
      price: parsedPrice,
      link: trimmedLink || undefined,
    });

    resetFields();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="상품 추가">
      <BodyStack>
        <FormField label="상품명" required>
          <TextInput
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="예: 에어팟 프로 1 로우"
          />
        </FormField>

        <FormField label="상품금액" required>
          <TextInput
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="예: 129000"
            inputMode="numeric"
          />
        </FormField>

        <FormField
          label="상품 링크"
          helpText="링크는 추후에 추가하거나 수정할 수 있어요."
        >
          <TextInput
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="상품 URL을 입력하거나 비워두세요"
          />
        </FormField>

        <Button variant="primary" size="lg" fullWidth onClick={handleAdd}>
          상품 추가하기
        </Button>
      </BodyStack>
    </Modal>
  );
};
