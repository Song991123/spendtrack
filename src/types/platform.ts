export const PLATFORMS = ["쿠팡", "네이버쇼핑", "무신사"] as const;

export type Platform = (typeof PLATFORMS)[number];

export interface PlatformPalette {
  bg: string;
  fg: string;
  border: string;
  dot: string;
}

export interface PlatformSummary {
  platform: Platform;
  amount: number;
  count: number;
}

export const isPlatform = (value: string): value is Platform => {
  return PLATFORMS.includes(value as Platform);
};