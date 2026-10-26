import { colors } from "@/themes/colors";
import React, { forwardRef, useImperativeHandle } from "react";
import { View, TextInput, Animated, Pressable, Text } from "react-native";
import { useFloatingTextInput } from "@/hooks";
import type { FloatingTextInputProps } from "@/types";

export type { FloatingTextInputProps };

export const FloatingTextInput = forwardRef<TextInput, FloatingTextInputProps>(
  (
    {
      label,
      required = false,
      value: controlledValue,
      defaultValue,
      error,
      errorStyle,
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
    ref,
  ) => {
    const {
      inputRef,
      text,
      isFloating,
      handleFocus,
      handleBlur,
      handleChangeText,
      handleContainerPress,
      labelTop,
      labelFontSize,
      labelColor,
      borderColor,
    } = useFloatingTextInput({
      value: controlledValue,
      defaultValue,
      error,
      editable,
      onFocus,
      onBlur,
      onChangeText,
    });

    useImperativeHandle(ref, () => inputRef.current as TextInput);

    return (
      <View className="w-full">
        <Pressable
          onPress={handleContainerPress}
          style={[
            {
              height: 56,
              borderRadius: 12,
              borderWidth: 1,
              borderColor,
              backgroundColor: editable ? colors.white : colors.surface,
              paddingHorizontal: 16,
              justifyContent: "center",
              position: "relative",
            },
            containerStyle,
          ]}
        >
          {leftIcon && <View className="mr-2 justify-center">{leftIcon}</View>}

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
                  color: editable
                    ? isFloating
                      ? colors.black70
                      : colors.black
                    : colors.black40,
                  fontFamily: "DMSans_400Regular",
                }}
              >
                {" "}
                *
              </Text>
            )}
          </Animated.Text>

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
                color: editable ? "#09090b" : colors.black40,
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

        {error ? (
          <Text
            style={[
              {
                color: colors.red,
                fontFamily: "DMSans_400Regular",
                fontSize: 12,
                marginTop: 6,
                marginLeft: 4,
                lineHeight: 16,
              },
              errorStyle,
            ]}
          >
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);

FloatingTextInput.displayName = "FloatingTextInput";
export default FloatingTextInput;
