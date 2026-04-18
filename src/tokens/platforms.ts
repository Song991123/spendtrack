import type { Platform, PlatformPalette } from "../types/platform";

export const PLATFORM_COLORS: Record<Platform, PlatformPalette> = {
  쿠팡: {
    bg: "#FEF3C7",
    fg: "#B45309",
    border: "#F59E0B",
    dot: "#F59E0B",
  },
  네이버쇼핑: {
    bg: "#D1FAE5",
    fg: "#0F9B54",
    border: "#0F9B54",
    dot: "#10B981",
  },
  무신사: {
    bg: "#EEE7FF",
    fg: "#6D28D9",
    border: "#AB81FE",
    dot: "#8B5CF6",
  },
};