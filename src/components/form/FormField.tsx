import type { ReactNode } from "react";
import styled from "styled-components";

interface FormFieldProps {
  label: string;
  required?: boolean;
  helpText?: string;
  children: ReactNode;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #333333;
`;

const Required = styled.span`
  color: #E54D4D;
`;

const HelpText = styled.span`
  font-size: 11px;
  color: #9CA3AF;
  line-height: 1.45;
`;

export const FormField = ({
  label,
  required,
  helpText,
  children,
}: FormFieldProps) => (
  <Wrapper>
    <Label>
      {label}
      {required && <Required> *</Required>}
    </Label>
    {children}
    {helpText && <HelpText>{helpText}</HelpText>}
  </Wrapper>
);
