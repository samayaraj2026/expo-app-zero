import React, { memo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { BackIcon } from "@/assets";
import { colors } from "@/themes/colors";
import type { BackButtonProps } from "@/types/button";

const BackButton = memo(function BackButton({
  onPress,
  activeOpacity = 0.7,
  style,
  className,
  disabled = false,
  testID,
  iconWidth = 9,
  iconHeight = 16,
  strokeColor = "#000000",
  strokeWidth = 2,
}: BackButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      className={className}
      style={[styles.backButton, style]}
    >
      <BackIcon
        width={iconWidth}
        height={iconHeight}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </TouchableOpacity>
  );
});

export default BackButton;

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    // Exact drop shadow from design spec: box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, 0.12);
    boxShadow: "0px 8px 32px 0px rgba(0, 0, 0, 0.12)",
    shadowColor: colors.semi_transparent_white,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
});
