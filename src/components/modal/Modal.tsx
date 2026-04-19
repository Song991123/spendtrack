/**
 * 역할: 모달 레이어를 통해 보조 입력 흐름을 처리하는 공통 컴포넌트입니다.
 * 위치: src\components\modal\Modal.tsx
 */
import type { ReactNode } from "react";
import styled from "styled-components";
import { media } from "../../tokens/breakpoints";
import { tokens } from "../../styles/tokens";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Overlay = styled.button`
  position: fixed;
  inset: 0;
  background: rgba(11, 18, 32, 0.4);
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
  background: ${tokens.color.panel};
  border-radius: ${tokens.radius.modal};
  z-index: 1001;
  box-shadow: ${tokens.shadow.modal};
  overflow: hidden;

  ${media.mobile} {
    width: calc(100% - 32px);
    max-width: 480px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 24px 28px 20px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${tokens.color.ink1};
  font-size: 18px;
  font-weight: 700;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: ${tokens.color.ink4};
  cursor: pointer;
  font-family: inherit;
  font-size: 20px;
  line-height: 1;
`;

const Divider = styled.div`
  height: 1px;
  background: ${tokens.color.line2};
`;

const Body = styled.div`
  padding: 24px 28px 28px;
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
            ×
          </CloseButton>
        </Header>
        <Divider />
        <Body>{children}</Body>
      </ModalCard>
    </>
  );
};

