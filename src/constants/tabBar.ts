import { Platform } from "react-native";

/**
 * Floating Tab Bar Layout & Styling Constants
 */
export const TAB_BAR_HORIZONTAL_OFFSET = 33;
export const TAB_BAR_HEIGHT = 62;
export const TAB_BAR_BORDER_RADIUS = 99;
export const TAB_BAR_MIN_BOTTOM = 24;
export const TAB_BAR_BOTTOM_SPACING = 10;

export const TAB_BAR_BLUR_INTENSITY = Platform.OS === "ios" ? 85 : 80;
export const TAB_BAR_BLUR_TINT = "light" as const;

export const TAB_PILL_WIDTH = 80;
export const TAB_PILL_HEIGHT = 54;
export const TAB_PILL_BORDER_RADIUS = 9999;
export const TAB_ACTIVE_PILL_BG = "#0000001A";

export const TAB_BAR_BORDER_COLOR = "rgba(255, 255, 255, 0.65)";
export const TAB_BAR_BOX_SHADOW = "0 8px 32px 0 rgba(0, 0, 0, 0.12)";
export const TAB_BAR_SHADOW = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 32,
  elevation: 8,
};

export const DEFAULT_CART_COUNT = 1;

export const TAB_ICON_SIZES = {
  home: { width: 21, height: 21 },
  catalogue: { width: 20, height: 21 },
  cart: { width: 20, height: 21 },
  profile: { width: 17, height: 21 },
} as const;
