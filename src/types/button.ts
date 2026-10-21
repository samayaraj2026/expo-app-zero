import type React from "react";
import type { ImageSourcePropType } from "react-native";

export type ButtonVariant = "solid" | "outline" | "ghost" | "stepper" | "icon";
export type ButtonSize = "sm" | "md" | "lg";

export interface BaseProps {
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
}

export interface SolidOutlineGhostProps extends BaseProps {
  variant?: "solid" | "outline" | "ghost" | "secondary";
  label: string;
  onPress: () => void;
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
}

export type AppButtonProps =
  | SolidOutlineGhostProps
  | IconButtonProps
  | StepperProps;
