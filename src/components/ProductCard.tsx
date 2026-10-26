import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { PlusIcon } from "@/assets";
import { AppButton } from "@/components/ui";
import type { ProductCardProps } from "@/types";
import { colors } from "@/themes/colors";

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
  initialQuantity = 0,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleQuantityChange = (next: number) => {
    setQuantity(next);
    onAddToCart?.(product, next);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(product)}
      className="w-[124px] mr-3"
    >
      {/* Image Container */}
      <View className="w-[124px] h-[124px] relative">
        <View className="w-full h-full bg-surface rounded-lg overflow-hidden items-center justify-center">
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View className="w-full h-full bg-surface" />
          )}
        </View>

        {/* Action Button at bottom rightmost place based on reference image */}
        <View
          style={{
            position: "absolute",
            bottom: -4,
            right: -4,
            zIndex: 10,
          }}
          className="shadow-sm"
        >
          <AppButton
            variant="stepper"
            size="md"
            value={quantity}
            icon={<PlusIcon width={14} height={14} stroke={colors.white} />}
            onValueChange={handleQuantityChange}
          />
        </View>
      </View>

      {/* Product Details */}
      <View className="mt-3.5">
        {/* Title */}
        <Text
          numberOfLines={2}
          className="font-dm-medium text-[14px] text-black leading-[18px]"
        >
          {product.name}
        </Text>

        {/* Package info badge */}
        {product.packageInfo ? (
          <View className="bg-surface rounded-md px-2 py-0.5 self-start mt-1">
            <Text className="font-dm-regular text-xs text-black/70">
              {product.packageInfo}
            </Text>
          </View>
        ) : null}

        {/* Supplier / Brand */}
        {product.supplier ? (
          <Text
            numberOfLines={1}
            className="font-dm-regular text-xs text-black/70 mt-0.5"
          >
            {product.supplier}
          </Text>
        ) : null}

        {/* Price */}
        <Text className="font-dm-semibold text-base text-black mt-1.5">
          {product.currency}
          {product.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
