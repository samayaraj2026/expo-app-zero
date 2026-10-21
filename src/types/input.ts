import type React from "react";
import type {
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

export interface FloatingTextInputProps
  extends Omit<TextInputProps, "placeholder"> {
  label: string;
  required?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface PasswordTextInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  errorStyle?: StyleProp<TextStyle>;
  showToggle?: boolean;
  visibleIcon?: React.ReactNode;
  hiddenIcon?: React.ReactNode;
  isPasswordVisible?: boolean;
  defaultPasswordVisible?: boolean;
  onToggleVisibility?: (isVisible: boolean) => void;
  leftIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export interface SearchTextInputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  onPressLeftIcon?: () => void;
  rightIcon?: React.ReactNode;
  onPressRightIcon?: () => void;
  showDivider?: boolean;
  showClearButton?: boolean;
  onClear?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  dividerStyle?: StyleProp<ViewStyle>;
}
