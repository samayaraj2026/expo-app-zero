import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/themes/colors";
import type { VariantCardProps } from "@/types";

const VariantCard = memo(function VariantCard({
  variant,
  isSelected,
  currency = "£",
  onSelect,
}: VariantCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect(variant)}
      style={[
        styles.variantCard,
        isSelected
          ? styles.variantCardSelected
          : styles.variantCardUnselected,
      ]}
    >
      <Text
        numberOfLines={1}
        className="font-dm-medium text-sm text-black"
      >
        {variant.title}
      </Text>
      <Text
        numberOfLines={1}
        className="font-dm-regular text-xsm text-content_default_secondary mt-0.5"
      >
        {variant.subtitle}
      </Text>
      <View className="flex-row items-baseline mt-3">
        <Text className="font-dm-semibold text-base text-black">
          {currency}
          {variant.price.toFixed(2)}
        </Text>
        {variant.originalPrice ? (
          <Text className="font-dm-regular text-sm text-Content_Default_Disabled line-through ml-1">
            {currency}
            {variant.originalPrice.toFixed(2)}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
});

export default VariantCard;

const styles = StyleSheet.create({
  variantCard: {
    width: 160,
    height: 96,
    borderRadius: 12,
    padding: 10,
    marginRight: 8,
  },
  variantCardSelected: {
    borderWidth: 1,
    borderColor: colors.blue,
    backgroundColor: colors.secondary,
  },
  variantCardUnselected: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
});
