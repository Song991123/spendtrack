import styled, { css } from "styled-components";

type TagVariant = "type" | "status" | "platform" | "source";

interface TagProps {
  variant: TagVariant;
  value: string;
}

const filledToneMap: Record<string, { bg: string; text: string }> = {
  "type:지출": { bg: "#FDE8E8", text: "#D92626" },
  "type:수입": { bg: "#E8F0FE", text: "#3E76FC" },
  "status:구매": { bg: "#EDF2FF", text: "#3E76FC" },
  "status:환불": { bg: "#FFF5EB", text: "#E58C1A" },
  "status:반품": { bg: "#FFF5EB", text: "#E58C1A" },
  "status:취소": { bg: "#F0F0F0", text: "#808080" },
  "status:정기결제": { bg: "#EDF2FF", text: "#3E76FC" },
  "status:구독": { bg: "#EDF2FF", text: "#3E76FC" },
  "source:OCR": { bg: "#EDF2FF", text: "#3E76FC" },
  "source:직접": { bg: "#F0F0F0", text: "#808080" },
};

const platformToneMap: Record<string, { border: string; text: string }> = {
  쿠팡: { border: "#FF4B00", text: "#FF4B00" },
  네이버쇼핑: { border: "#03C75A", text: "#03C75A" },
  무신사: { border: "#222222", text: "#222222" },
};

const getFilledTone = (variant: Exclude<TagVariant, "platform">, value: string) =>
  filledToneMap[`${variant}:${value}`] ?? { bg: "#F0F0F0", text: "#808080" };

const getPlatformTone = (value: string) =>
  platformToneMap[value] ?? { border: "#D9D9D9", text: "#6B7280" };

const StyledTag = styled.span<{
  $variant: TagVariant;
  $value: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 11px;
  line-height: 1;

  ${({ $variant, $value }) => {
    if ($variant === "platform") {
      const tone = getPlatformTone($value);

      return css`
        background: #FFFFFF;
        color: ${tone.text};
        border: 1px solid ${tone.border};
        border-radius: 6px;
        padding: 4px 14px;
        font-weight: 600;
      `;
    }

    const tone = getFilledTone($variant, $value);

    return css`
      background: ${tone.bg};
      color: ${tone.text};
      border: none;
      border-radius: 4px;
      padding: 4px 10px;
      font-weight: 600;
    `;
  }}
`;

export const Tag = ({ variant, value }: TagProps) => (
  <StyledTag $variant={variant} $value={value}>
    {value}
  </StyledTag>
);
