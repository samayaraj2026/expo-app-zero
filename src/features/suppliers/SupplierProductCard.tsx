import React, { memo, useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { MinusIcon, PlusIcon } from "@/assets";
import { haptics } from "@/utils/haptics";
import { colors } from "@/themes/colors";
import type { Product } from "@/types/catalogue";

export interface SupplierProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  initialQuantity?: number;
}

const styles = StyleSheet.create({
  actionButtonContainer: {
    position: "absolute",
    bottom: -6,
    left: 12,
    right: 12,
    zIndex: 10,
  },
  hitSlop: {
    top: 8,
    bottom: 8,
    left: 8,
    right: 8,
  },
});

export const SupplierProductCard = memo(function SupplierProductCard({
  product,
  onPress,
  onAddToCart,
  initialQuantity = 0,
}: SupplierProductCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleCardPress = useCallback(() => {
    onPress?.(product);
  }, [onPress, product]);

  const handleAdd = useCallback(() => {
    haptics.light();
    setQuantity((prevQuantity) => {
      const nextQuantity = prevQuantity + 1;
      onAddToCart?.(product, nextQuantity);
      return nextQuantity;
    });
  }, [product, onAddToCart]);

  const handleIncrement = useCallback(() => {
    haptics.light();
    setQuantity((prevQuantity) => {
      const nextQuantity = prevQuantity + 1;
      onAddToCart?.(product, nextQuantity);
      return nextQuantity;
    });
  }, [product, onAddToCart]);

  const handleDecrement = useCallback(() => {
    haptics.light();
    setQuantity((prevQuantity) => {
      const nextQuantity = Math.max(0, prevQuantity - 1);
      onAddToCart?.(product, nextQuantity);
      return nextQuantity;
    });
  }, [product, onAddToCart]);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handleCardPress}
      className="flex-row items-center justify-between py-2.5 mb-2.5"
    >
      {/* Left Column: Product Info */}
      <View className="flex-1 pr-4 justify-center">
        {/* Product Title */}
        <Text
          numberOfLines={2}
          className="font-dm-medium text-base text-black leading-[20px]"
        >
          {product.name}
        </Text>

        {/* Package Badge */}
        {product.packageInfo ? (
          <View className="bg-surface rounded-md px-2 py-0.5 self-start mt-1.5">
            <Text className="font-dm-regular text-xs text-black70">
              {product.packageInfo}
            </Text>
          </View>
        ) : null}

        {/* Supplier Name */}
        {product.supplier ? (
          <Text
            numberOfLines={1}
            className="font-dm-regular text-xs text-black70 mt-1"
          >
            {product.supplier}
          </Text>
        ) : null}

        {/* Price */}
        <Text className="font-dm-semibold text-base text-black mt-3">
          {product.currency}
          {product.price.toFixed(2)}
        </Text>
      </View>

      {/* Right Column: Image Container + Overlapping Action Button */}
      <View className="w-[124px] h-[124px] relative items-center justify-center">
        {/* Rounded Image Box with overflow hidden */}
        <View className="w-full h-full bg-surface rounded-xl overflow-hidden items-center justify-center">
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View className="w-full h-full bg-surface" />
          )}
        </View>

        {/* Action Button positioned outside the image box by 2px */}
        <View style={styles.actionButtonContainer}>
          {quantity === 0 ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={(event) => {
                event.stopPropagation();
                handleAdd();
              }}
              className="w-full h-[36px] bg-primary rounded-lg items-center justify-center"
            >
              <Text className="font-dm-bold text-xs text-white tracking-wider">
                ADD
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="w-full h-[36px] bg-primary rounded-lg flex-row items-center justify-between px-3">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={(event) => {
                  event.stopPropagation();
                  handleDecrement();
                }}
                hitSlop={styles.hitSlop}
                className="items-center justify-center p-1"
              >
                <MinusIcon width={12} height={12} stroke={colors.white} />
              </TouchableOpacity>

              <Text className="font-dm-bold text-xs text-white">
                {quantity}
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={(event) => {
                  event.stopPropagation();
                  handleIncrement();
                }}
                hitSlop={styles.hitSlop}
                className="items-center justify-center p-1"
              >
                <PlusIcon width={12} height={12} stroke={colors.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default SupplierProductCard;
