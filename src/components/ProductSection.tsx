import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { AppButton } from '@/components/ui';
import { NextIcon } from '@/assets';
import ProductCard from './ProductCard';
import type { ProductSectionProps } from '@/types';

export default function ProductSection({
  title,
  products,
  onSeeAll,
  onProductPress,
  onAddToCart,
}: ProductSectionProps) {
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={onProductPress}
            onAddToCart={onAddToCart}
          />
        )}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
      />

      {/* See All Button */}
      <View className="px-5 mt-4">
        <AppButton
          variant="secondary"
          size="lg"
          label="See all"
          rightIcon={<NextIcon width={6} height={10} />}
          fullWidth
          onPress={() => onSeeAll?.()}
        />
      </View>
    </View>
  );
}
