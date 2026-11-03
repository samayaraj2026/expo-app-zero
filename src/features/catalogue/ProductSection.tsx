import React, { memo, useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/ui";
import { NextIcon } from "@/assets";
import ProductCard from "./ProductCard";
import type { Product, ProductSectionProps } from "@/types";

const ProductSection = memo(function ProductSection({
  title,
  products,
  onSeeAll,
  onProductPress,
  onAddToCart,
}: ProductSectionProps) {
  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={onProductPress}
        onAddToCart={onAddToCart}
      />
    ),
    [onProductPress, onAddToCart],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const handleSeeAllPress = useCallback(() => {
    onSeeAll?.();
  }, [onSeeAll]);

  return (
    <View className="mb-10">
      {/* Section Title */}
      <Text className="font-dm-semibold text-lg text-black mb-3 px-5">
        {title}
      </Text>

      {/* Horizontal Scrolling Products List */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
      />

      {/* See All Button */}
      <View className="px-5 mt-4">
        <AppButton
          variant="secondary"
          size="lg"
          label="See all"
          rightIcon={<NextIcon width={6} height={10} />}
          fullWidth
          onPress={handleSeeAllPress}
        />
      </View>
    </View>
  );
});

export default ProductSection;

const styles = StyleSheet.create({
  listContent: {
    paddingLeft: 20,
    paddingRight: 8,
  },
});
