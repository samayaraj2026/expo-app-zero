import React, { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { AppButton } from "@/components/ui";
import { haptics } from "@/utils/haptics";
import type { ProductRowCardProps } from "@/types";

const ProductRowCard = memo(function ProductRowCard({
  product,
  onPress,
  onAddToCart,
  initialQuantity = 0,
}: ProductRowCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleQuantityChange = (next: number) => {
    setQuantity(next);
    onAddToCart?.(product, next);
  };

  const handleAdd = () => {
    haptics.error();
    handleQuantityChange(quantity + 1);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(product)}
      className="flex-row mb-4 items-center w-full"
    >
      {/* Product Image Container */}
      <View className="w-[134px] h-[134px] bg-surface rounded-2xl overflow-hidden items-center justify-center mr-3">
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

      {/* Product Info & Action */}
      <View className="flex-1 h-[136px] justify-between py-1">
        <View>
          {/* Title */}
          <Text
            numberOfLines={2}
            className="font-dm-medium text-base text-black leading-[16px]"
          >
            {product.name}
          </Text>

          {/* Package Badge */}
          {product.packageInfo ? (
            <View className="bg-surface rounded-md px-1.5 py-0.5 self-start mt-1">
              <Text className="font-dm-regular text-xs text-black/70">
                {product.packageInfo}
              </Text>
            </View>
          ) : null}

          {/* Supplier */}
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

        {/* Add to Cart or Stepper using reusable AppButton */}
        {quantity === 0 ? (
          <AppButton
            variant="solid"
            fullWidth
            label="Add to cart"
            onPress={handleAdd}
            style={styles.actionButton}
          />
        ) : (
          <AppButton
            variant="stepper"
            value={quantity}
            onValueChange={handleQuantityChange}
            style={styles.stepperButton}
          />
        )}
      </View>
    </TouchableOpacity>
  );
});

export default ProductRowCard;

const styles = StyleSheet.create({
  actionButton: {
    width: "100%",
    alignSelf: "stretch",
    height: 40,
    borderRadius: 8,
    // gap: 6,
    opacity: 1,
    padding: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperButton: {
    width: "100%",
    alignSelf: "stretch",
    height: 40,
    borderRadius: 8,
    // gap: 6,
    opacity: 1,
    padding: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
