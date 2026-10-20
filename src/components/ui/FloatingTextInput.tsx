import { colors } from "@/themes/colors";
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  TextInput,
  Animated,
  Pressable,
  Text,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

export interface FloatingTextInputProps extends Omit<TextInputProps, "placeholder"> {
  label: string;
  required?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const FloatingTextInput = forwardRef<TextInput, FloatingTextInputProps>(
  (
    {
      label,
      required = false,
      value: controlledValue,
      defaultValue,
      error,
      editable = true,
      onFocus,
      onBlur,
      onChangeText,
      containerStyle,
      inputStyle,
      labelStyle,
      leftIcon,
      rightIcon,
      style,
      ...restProps
    },
    ref
  ) => {
    const inputRef = useRef<TextInput>(null);
    useImperativeHandle(ref, () => inputRef.current as TextInput);

    // Track internal text state for uncontrolled or controlled usage
    const [text, setText] = useState<string>(controlledValue ?? defaultValue ?? "");
    const [isFocused, setIsFocused] = useState<boolean>(false);

    // Synchronize when controlled value changes
    useEffect(() => {
      if (controlledValue !== undefined) {
        setText(controlledValue);
      }
    }, [controlledValue]);

    const hasValue = text.length > 0;
    const isFloating = isFocused || hasValue;

    // Animation progress: 0 (resting) -> 1 (floated)
    const animatedValue = useRef(new Animated.Value(isFloating ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: isFloating ? 1 : 0,
        duration: 160,
        useNativeDriver: false,
      }).start();
    }, [isFloating, animatedValue]);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChangeText = (newText: string) => {
      if (controlledValue === undefined) {
        setText(newText);
      }
      onChangeText?.(newText);
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
        editable ? colors.black : "rgba(0, 0, 0, 0.4)",
        editable ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.4)",
      ],
    });

    // Dynamic border color
    const getBorderColor = () => {
      if (error) return "#ef4444";
      if (!editable) return colors.border;
      if (isFocused) return colors.border;
      return "#e4e4e7";
    };

    return (
      <View className="w-full">
        <Pressable
          onPress={() => {
            if (editable) {
              inputRef.current?.focus();
            }
          }}
          style={[
            {
              height: 56,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: getBorderColor(),
              backgroundColor: editable ? colors.white: colors.surface,
              paddingHorizontal: 16,
              justifyContent: "center",
              position: "relative",
            },
            containerStyle,
          ]}
        >
          {leftIcon && <View className="mr-2 justify-center">{leftIcon}</View>}

          {/* Floating Animated Label */}
          <Animated.Text
            numberOfLines={1}
            style={[
              {
                position: "absolute",
                left: leftIcon ? 44 : 16,
                top: labelTop,
                fontSize: labelFontSize,
                color: labelColor,
                fontFamily: "DMSans_400Regular",
              },
              labelStyle,
            ]}
          >
            {label}
            {required && (
              <Text
                style={{
                  color: editable ? (isFloating ? "rgba(0, 0, 0, 0.7)" : colors.black) : "rgba(0, 0, 0, 0.4)",
                  fontFamily: "DMSans_400Regular",
                }}
              >
                {" "}*
              </Text>
            )}
          </Animated.Text>

          {/* Actual Input */}
          <TextInput
            ref={inputRef}
            value={controlledValue !== undefined ? controlledValue : text}
            editable={editable}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            cursorColor={restProps.cursorColor ?? colors.blue}
            selectionHandleColor={restProps.selectionHandleColor ?? colors.blue}
            style={[
              {
                paddingTop: isFloating || !editable ? 20 : 0,
                paddingBottom: isFloating || !editable ? 4 : 0,
                paddingHorizontal: 0,
                paddingLeft: 0,
                paddingRight: 0,
                includeFontPadding: false,
                fontSize: editable ? 16 : 14,
                fontFamily: editable ? "DMSans_400Regular" : "DMSans_500Medium",
                color: editable ? "#09090b" : "rgba(0, 0, 0, 0.4)",
                height: "100%",
              },
              inputStyle,
              style,
            ]}
            {...restProps}
          />

          {rightIcon && (
            <View className="absolute right-4 top-0 bottom-0 justify-center">
              {rightIcon}
            </View>
          )}
        </Pressable>

        {/* Error message */}
        {error ? (
          <Text className="text-red-500 font-dm-regular text-xs mt-1 ml-1">
            {error}
          </Text>
        ) : null}
      </View>
    );
  }
);

FloatingTextInput.displayName = "FloatingTextInput";
export default FloatingTextInput;
