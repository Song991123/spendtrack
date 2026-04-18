import type { ReactNode } from "react";
import styled from "styled-components";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Overlay = styled.button`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  padding: 0;
  z-index: 1000;
  cursor: default;
`;

const ModalCard = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
  max-width: calc(100vw - 32px);
  background: #FFFFFF;
  border-radius: 16px;
  z-index: 1001;
  box-shadow: 0 24px 60px rgba(17, 24, 39, 0.18);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 24px 32px 20px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 18px;
  color: #999999;
  cursor: pointer;
  line-height: 1;
  font-family: inherit;
`;

const Divider = styled.div`
  height: 1px;
  background: #EBEBEB;
`;

const Body = styled.div`
  padding: 24px 32px 28px;
`;

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Overlay type="button" aria-label="모달 닫기" onClick={onClose} />
      <ModalCard role="dialog" aria-modal="true" aria-label={title}>
        <Header>
          <Title>{title}</Title>
          <CloseButton type="button" aria-label="닫기" onClick={onClose}>
            ✕
          </CloseButton>
        </Header>
        <Divider />
        <Body>{children}</Body>
      </ModalCard>
    </>
  );
};
