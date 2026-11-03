import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, type TextInput } from "react-native";
import { colors } from "@/themes/colors";
import type {
  UseFloatingTextInputOptions,
  UseFloatingTextInputReturn,
} from "@/types/input";

/**
 * Custom hook encapsulating animation, focus state, text sync,
 * and style interpolations for the floating label text input.
 */
export function useFloatingTextInput({
  value: controlledValue,
  defaultValue,
  error,
  editable = true,
  onFocus,
  onBlur,
  onChangeText,
}: UseFloatingTextInputOptions): UseFloatingTextInputReturn {
  const inputRef = useRef<TextInput>(null);

  // Track internal text state for uncontrolled or controlled usage
  const [uncontrolledText, setUncontrolledText] = useState<string>(
    defaultValue ?? "",
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const text =
    controlledValue !== undefined ? controlledValue : uncontrolledText;
  const hasValue = text.length > 0;
  const isFloating = isFocused || hasValue;

  // Animation progress: 0 (resting) -> 1 (floated)
  const [animatedValue] = useState(
    () => new Animated.Value(isFloating ? 1 : 0),
  );

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFloating ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [isFloating, animatedValue]);

  const handleFocus: NonNullable<UseFloatingTextInputReturn["handleFocus"]> =
    useCallback(
      (event) => {
        setIsFocused(true);
        onFocus?.(event);
      },
      [onFocus],
    );

  const handleBlur: NonNullable<UseFloatingTextInputReturn["handleBlur"]> =
    useCallback(
      (event) => {
        setIsFocused(false);
        onBlur?.(event);
      },
      [onBlur],
    );

  const handleChangeText = useCallback(
    (newText: string) => {
      if (controlledValue === undefined) {
        setUncontrolledText(newText);
      }
      onChangeText?.(newText);
    },
    [controlledValue, onChangeText],
  );

  const handleContainerPress = useCallback(() => {
    if (editable) {
      inputRef.current?.focus();
    }
  }, [editable]);

  // Label position and typography interpolations
  const labelTop = useMemo(
    () =>
      animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [editable ? 18 : 9, 9],
      }),
    [animatedValue, editable],
  );

  const labelFontSize = useMemo(
    () =>
      animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [editable ? 16 : 12, 12],
      }),
    [animatedValue, editable],
  );

  const labelColor = useMemo(
    () =>
      animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [
          editable ? colors.black : colors.black40,
          editable ? colors.black70 : colors.black40,
        ],
      }),
    [animatedValue, editable],
  );

  // Dynamic border color
  const borderColor = useMemo((): string => {
    if (error) return colors.red;
    if (!editable) return colors.border;
    if (isFocused) return colors.border;
    return colors.zinc200;
  }, [error, editable, isFocused]);

  return {
    inputRef,
    text,
    isFocused,
    isFloating,
    animatedValue,
    handleFocus,
    handleBlur,
    handleChangeText,
    handleContainerPress,
    labelTop,
    labelFontSize,
    labelColor,
    borderColor,
  };
}
