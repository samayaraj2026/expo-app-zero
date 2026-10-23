import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  type TextInput,
} from 'react-native';
import { colors } from '@/themes/colors';
import type {
  UseFloatingTextInputOptions,
  UseFloatingTextInputReturn,
} from '@/types/input';

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
  const [uncontrolledText, setUncontrolledText] = useState<string>(defaultValue ?? '');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const text = controlledValue !== undefined ? controlledValue : uncontrolledText;
  const hasValue = text.length > 0;
  const isFloating = isFocused || hasValue;

  // Animation progress: 0 (resting) -> 1 (floated)
  const [animatedValue] = useState(() => new Animated.Value(isFloating ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFloating ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [isFloating, animatedValue]);

  const handleFocus: NonNullable<UseFloatingTextInputReturn['handleFocus']> = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: NonNullable<UseFloatingTextInputReturn['handleBlur']> = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChangeText = (newText: string) => {
    if (controlledValue === undefined) {
      setUncontrolledText(newText);
    }
    onChangeText?.(newText);
  };

  const handleContainerPress = () => {
    if (editable) {
      inputRef.current?.focus();
    }
  };

  // Label position and typography interpolations
  const labelTop = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [editable ? 18 : 9, 9],
  });

  const labelFontSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [editable ? 16 : 12, 12],
  });

  const labelColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      editable ? colors.black : colors.black40,
      editable ? colors.black70 : colors.black40,
    ],
  });

  // Dynamic border color
  const getBorderColor = (): string => {
    if (error) return colors.red;
    if (!editable) return colors.border;
    if (isFocused) return colors.border;
    return '#e4e4e7';
  };

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
    borderColor: getBorderColor(),
  };
}
