import React, { forwardRef, useRef, useImperativeHandle, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  Text,
} from "react-native";

import { SearchIcon, QueIcon } from "@/assets";
import { colors } from "@/themes/colors";
import type { SearchTextInputProps } from "@/types";

export type { SearchTextInputProps };

export const SearchTextInput = forwardRef<TextInput, SearchTextInputProps>(

  (
    {
      leftIcon,
      onPressLeftIcon,
      rightIcon,
      onPressRightIcon,
      showDivider = true,
      showClearButton = false,
      onClear,
      placeholder = "Search all product",
      value: controlledValue,
      defaultValue,
      onChangeText,
      containerStyle,
      inputStyle,
      dividerStyle,
      editable = true,
      style,
      ...restProps
    },
    ref
  ) => {
    const inputRef = useRef<TextInput>(null);
    useImperativeHandle(ref, () => inputRef.current as TextInput);

    const [text, setText] = useState<string>(controlledValue ?? defaultValue ?? "");
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const currentText = controlledValue !== undefined ? controlledValue : text;
    const hasText = currentText.length > 0;

    const handleChangeText = (val: string) => {
      if (controlledValue === undefined) {
        setText(val);
      }
      onChangeText?.(val);
    };

    const handleClear = () => {
      handleChangeText("");
      onClear?.();
      inputRef.current?.focus();
    };

    const renderLeft = () => {
      const content = leftIcon !== undefined ? leftIcon : <SearchIcon width={15} height={15} />;
      if (!content) return null;

      if (onPressLeftIcon) {
        return (
          <Pressable
            hitSlop={8}
            onPress={onPressLeftIcon}
            className="mr-3 justify-center items-center active:opacity-60"
          >
            {content}
          </Pressable>
        );
      }
      return <View className="mr-3 justify-center items-center pointer-events-none">{content}</View>;
    };

    const renderRight = () => {
      const iconNode = rightIcon !== undefined ? rightIcon : <QueIcon width={20} height={18.33} />;
      if (!iconNode) return null;

      const rightNode = onPressRightIcon ? (
        <Pressable
          hitSlop={8}
          onPress={onPressRightIcon}
          className="justify-center items-center active:opacity-70"
        >
          {iconNode}
        </Pressable>
      ) : (
        <View className="justify-center items-center">{iconNode}</View>
      );

      return (
        <View className="flex-row items-center">
          {showDivider && (
            <View
              style={[
                {
                  width: 1,
                  height: 28,
                  backgroundColor: colors.border,
                  marginHorizontal: 12,
                },
                dividerStyle,
              ]}
            />
          )}
          {rightNode}
        </View>
      );
    };

    return (
      <Pressable
        onPress={() => {
          if (editable) {
            inputRef.current?.focus();
          }
        }}
        style={[
          {
            height: 48,
            borderRadius: 8,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.surface,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
          },
          containerStyle,
        ]}
      >
        {/* Left Icon (e.g. Magnifier) */}
        {renderLeft()}

        {/* Search Text Input */}
        <TextInput
          ref={inputRef}
          value={currentText}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor={colors.black70}
          selectionColor="#18181B"
          returnKeyType="search"
          onFocus={(e) => {
            setIsFocused(true);
            restProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            restProps.onBlur?.(e);
          }}
          onChangeText={handleChangeText}
          style={[
            {
              flex: 1,
              height: "100%",
              fontSize: 16,
              fontFamily: "DMSans_400Regular",
              // color: editable ? "#18181B" : "#A1A1AA",
              paddingVertical: 0,
            },
            inputStyle,
            style,
          ]}
          {...restProps}
        />

        {/* Clear Button (Optional) */}
        {showClearButton && hasText && editable && (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            className="w-5 h-5 rounded-full bg-zinc-300 justify-center items-center mr-1 active:opacity-70"
          >
            <Text className="text-zinc-700 font-dm-bold text-xs leading-none">✕</Text>
          </Pressable>
        )}

        {/* Vertical Divider + Right Action / Icon */}
        {renderRight()}
      </Pressable>
    );
  }
);

SearchTextInput.displayName = "SearchTextInput";
export default SearchTextInput;
