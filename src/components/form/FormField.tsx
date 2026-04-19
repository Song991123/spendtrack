import type { ReactNode } from "react";
import styled from "styled-components";
import { tokens } from "../../styles/tokens";

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
  color: ${tokens.color.ink2};
  font-size: 12px;
  font-weight: 600;
`;

const Required = styled.span`
  color: ${tokens.color.neg};
`;

const HelpText = styled.span`
  color: ${tokens.color.ink4};
  font-size: 11.5px;
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
