import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styled, { css } from "styled-components";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<Variant, ReturnType<typeof css>> = {
  primary: css`
    background: #4f6ef7;
    color: #ffffff;
    border: 1px solid #4f6ef7;
    box-shadow: 0 1px 2px rgba(79, 110, 247, 0.18);

    &:hover:not(:disabled) {
      background: #4060e6;
      border-color: #4060e6;
      box-shadow: 0 2px 6px rgba(79, 110, 247, 0.28);
    }
    &:active:not(:disabled) {
      background: #3752d0;
      box-shadow: none;
    }
  `,
  secondary: css`
    background: #ffffff;
    color: #374151;
    border: 1px solid #d1d5db;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

    &:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #bfc5cd;
    }
    &:active:not(:disabled) {
      background: #f3f4f6;
    }
  `,
  ghost: css`
    background: transparent;
    color: #4f6ef7;
    border: 1px dashed #d1d5db;

    &:hover:not(:disabled) {
      background: #eef2ff;
      border-color: #a5b4fc;
    }
    &:active:not(:disabled) {
      background: #e0e7ff;
    }
  `,
};

const sizeStyles: Record<Size, ReturnType<typeof css>> = {
  sm: css`
    height: 32px;
    padding: 0 12px;
    font-size: 12px;
    border-radius: 8px;
  `,
  md: css`
    height: 40px;
    padding: 0 16px;
    font-size: 13.5px;
    border-radius: 10px;
  `,
  lg: css`
    height: 46px;
    padding: 0 22px;
    font-size: 14.5px;
    border-radius: 12px;
  `,
};

const StyledButton = styled.button<{
  $variant: Variant;
  $size: Size;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: -0.1px;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      fullWidth,
      type = "button",
      children,
      ...rest
    },
    ref
  ) => (
    <StyledButton
      ref={ref}
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...rest}
    >
      {icon}
      {children}
    </StyledButton>
  )
);

Button.displayName = "Button";