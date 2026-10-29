import type React from "react";
import type {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

export type ButtonVariant = "solid" | "outline" | "ghost" | "stepper" | "icon";
export type ButtonSize = "sm" | "md" | "lg";

export type HapticFeedbackType =
  | "error"
  | "success"
  | "warning"
  | "heavy"
  | "rigid"
  | "hard"
  | "medium"
  | "light"
  | "soft"
  | "selection";

export interface BaseProps {
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  haptic?: HapticFeedbackType | boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textClassName?: string;
}

export interface SolidOutlineGhostProps extends BaseProps {
  variant?: "solid" | "outline" | "ghost" | "secondary";
  label: string;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  image?: ImageSourcePropType;
}

export interface IconButtonProps extends BaseProps {
  variant: "icon";
  label: string;
  onPress: () => void;
  icon: React.ReactNode;
}

export interface StepperProps extends BaseProps {
  variant: "stepper";
  value?: number;
  initialValue?: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number) => void;
  icon?: React.ReactNode;
  label?: string;
}

export interface BackButtonProps {
  onPress?: () => void;
  activeOpacity?: number;
  style?: StyleProp<ViewStyle>;
  className?: string;
  disabled?: boolean;
  testID?: string;
  iconWidth?: number;
  iconHeight?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface SearchCartPillProps {
  onSearchPress?: () => void;
  onCartPress?: () => void;
  cartCount?: number;
  showCartBadge?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  activeOpacity?: number;
  hitSlop?: import("react-native").Insets | number;
  searchIconWidth?: number;
  searchIconHeight?: number;
  searchIconStroke?: string;
  cartIconWidth?: number;
  cartIconHeight?: number;
  cartIconStroke?: string;
  testID?: string;
  searchTestID?: string;
  cartTestID?: string;
}

export type AppButtonProps =
  SolidOutlineGhostProps | IconButtonProps | StepperProps;

