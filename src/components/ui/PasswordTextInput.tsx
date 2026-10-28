import React, { forwardRef, useRef, useImperativeHandle, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
} from "react-native";
import { BottomSheetTextInput, useBottomSheetInternal } from "@gorhom/bottom-sheet";
import Svg, { Path } from "react-native-svg";
import { VisibleIcon } from "@/assets";
import { colors } from "@/themes/colors";
import type { PasswordTextInputProps } from "@/types";

export type { PasswordTextInputProps };

/** Built-in Hidden / Slashed Eye icon matching VisibleIcon's exact stroke & geometry */
export function DefaultHiddenEyeIcon({
  size = 20,
  color = "#000000",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={(size * 14) / 20} viewBox="0 0 20 14" fill="none">
      <Path
        d="M7.75 6.75C7.75 7.28043 7.96071 7.78914 8.33579 8.16421C8.71086 8.53929 9.21957 8.75 9.75 8.75C10.2804 8.75 10.7891 8.53929 11.1642 8.16421C11.5393 7.78914 11.75 7.28043 11.75 6.75"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.75 6.75C16.35 10.75 13.35 12.75 9.75 12.75C6.15 12.75 3.15 10.75 0.75 6.75C3.15 2.75 6.15 0.75 9.75 0.75C13.35 0.75 16.35 2.75 18.75 6.75Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.5 13L17.5 1"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function getInsertedCharsCount(oldStr: string, newStr: string): number {
  let start = 0;
  while (start < oldStr.length && start < newStr.length && oldStr[start] === newStr[start]) {
    start++;
  }
  let oldEnd = oldStr.length - 1;
  let newEnd = newStr.length - 1;
  while (oldEnd >= start && newEnd >= start && oldStr[oldEnd] === newStr[newEnd]) {
    oldEnd--;
    newEnd--;
  }
  return Math.max(0, newEnd - start + 1);
}

export const PasswordTextInput = forwardRef<TextInput, PasswordTextInputProps>(
  (
    {
      label,
      required = false,
      error,
      errorStyle,
      showToggle = true,
      visibleIcon,
      hiddenIcon,
      isPasswordVisible: controlledVisible,
      defaultPasswordVisible = false,
      onToggleVisibility,
      leftIcon,
      placeholder = "Create Password",
      value: controlledValue,
      defaultValue,
      onChangeText,
      containerStyle,
      inputStyle,
      editable = true,
      style,
      onFocus,
      onBlur,
      disablePaste = false,
      onPasteAttempt,
      ...restProps
    },
    ref,
  ) => {
    const isInsideBottomSheet = Boolean(useBottomSheetInternal(true));
    const InputComponent = (isInsideBottomSheet ? BottomSheetTextInput : TextInput) as any;

    const inputRef = useRef<TextInput>(null);
    useImperativeHandle(ref, () => inputRef.current as TextInput);

    const [text, setText] = useState<string>(
      controlledValue ?? defaultValue ?? "",
    );
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [internalVisible, setInternalVisible] = useState<boolean>(
      defaultPasswordVisible,
    );

    const isVisible =
      controlledVisible !== undefined ? controlledVisible : internalVisible;
    const currentText = controlledValue !== undefined ? controlledValue : text;

    const handleChangeText = (val: string) => {
      if (disablePaste) {
        const insertedCount = getInsertedCharsCount(currentText, val);
        if (insertedCount > 1) {
          onPasteAttempt?.();
          return;
        }
      }
      if (controlledValue === undefined) {
        setText(val);
      }
      onChangeText?.(val);
    };

    const toggleVisibility = () => {
      const nextState = !isVisible;
      if (controlledVisible === undefined) {
        setInternalVisible(nextState);
      }
      onToggleVisibility?.(nextState);
    };

    const getBorderColor = () => {
      if (error) return colors.red;
      if (!editable) return colors.border;
      if (isFocused) return "#18181B";
      return "#E4E4E7";
    };

    return (
      <View className="w-full">
        {label ? (
          <Text className="font-dm-medium text-xs text-zinc-500 mb-2 uppercase tracking-wider">
            {label}
            {required && <Text className="text-zinc-900"> *</Text>}
          </Text>
        ) : null}

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
              backgroundColor: editable ? "#FFFFFF" : "#F4F4F5",
              paddingHorizontal: 18,
              flexDirection: "row",
              alignItems: "center",
            },
            containerStyle,
          ]}
        >
          {leftIcon && (
            <View className="mr-3 justify-center items-center">{leftIcon}</View>
          )}

          <InputComponent
            ref={inputRef}
            value={currentText}
            editable={editable}
            placeholder={placeholder}
            placeholderTextColor={colors.black}
            secureTextEntry={!isVisible}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            selectionColor="#18181B"
            contextMenuHidden={disablePaste ? true : restProps.contextMenuHidden}
            onFocus={(e: any) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e: any) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            onChangeText={handleChangeText}
            style={[
              {
                flex: 1,
                height: "100%",
                fontSize: 16,
                fontFamily: "DMSans_400Regular",
                color: editable ? "#09090B" : "#71717A",
                paddingVertical: 0,
              },
              inputStyle,
              style,
            ]}
            {...restProps}
          />

          {showToggle && (
            <Pressable
              onPress={toggleVisibility}
              hitSlop={10}
              className="pl-3 justify-center items-center active:opacity-60"
              accessibilityRole="button"
              accessibilityLabel={isVisible ? "Hide password" : "Show password"}
            >
              {isVisible
                ? (visibleIcon ?? <VisibleIcon width={18} height={12} />)
                : (hiddenIcon ?? <DefaultHiddenEyeIcon size={18} />)}
            </Pressable>
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

PasswordTextInput.displayName = "PasswordTextInput";
export default PasswordTextInput;
