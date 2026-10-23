import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { AppButton, SearchTextInput } from '@/components/ui';
import { BackIcon, FilterIcon, SortIcon } from '@/assets';
import ProductRowCard from '@/components/ProductRowCard';
import {
  CATALOGUE_SECTIONS,
  ORDER_AGAIN_PRODUCTS,
  STATIONERY_PRODUCTS,
} from '@/constants/catalogue';
import { colors } from '@/themes/colors';

export default function CategoryScreen() {
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const categoryName = params.name || 'Stationery';
  const categoryId = params.id || 'stationery';

  const [searchQuery, setSearchQuery] = useState('');

  // Find products belonging to this category
  const products = useMemo(() => {
    const foundSection = CATALOGUE_SECTIONS.find(
      (s) => s.id === categoryId || s.title.toLowerCase() === categoryName.toLowerCase()
    );
    if (foundSection) return foundSection.products;
    if (categoryId === 'order_again') return ORDER_AGAIN_PRODUCTS;
    return STATIONERY_PRODUCTS;
  }, [categoryId, categoryName]);

  // Filter products by search query
  const displayedProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q) ||
        p.packageInfo.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          {/* Top Header */}
          <View className="flex-row items-center justify-between px-4 py-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <BackIcon width={9} height={16} stroke="#000000" strokeWidth={2} />
            </TouchableOpacity>

            <Text className="font-dm-semibold text-xl text-black text-center flex-1 mx-2">
              {categoryName}
            </Text>

            <View className="w-11" />
          </View>

          {/* Search Bar */}
          <View className="px-4 pt-4 pb-4">
            <SearchTextInput
              placeholder={`Search in ${categoryName.toLowerCase()}`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              showClearButton={Boolean(searchQuery)}
              onClear={() => setSearchQuery('')}
            />
          </View>

          {/* Sort & Filter Action Buttons */}
          <View className="flex-row gap-2 px-4 pb-5">
            <AppButton
              variant="icon"
              size="md"
              label="Sort"
              icon={<SortIcon width={16} height={16} stroke={colors.black} />}
              onPress={() => {}}
            />
            <AppButton
              variant="icon"
              size="md"
              label="Filter"
              icon={<FilterIcon width={16} height={16} stroke={colors.black}  />}
              onPress={() => {}}
            />
          </View>

          {/* Subtle Divider */}
          <View className="border-b border-border w-full" />

          {/* Vertical Product List */}
          <FlatList
            data={displayedProducts}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 20,
              paddingBottom: 120, // Breathing space so last item floats above the tab bar
            }}
            renderItem={({ item }) => (
              <ProductRowCard
                product={item}
                onAddToCart={(product, qty) => {
                  console.log(`Cart: ${product.name} x${qty}`);
                }}
              />
            )}
            ListEmptyComponent={
              <View className="items-center justify-center py-16">
                <Text className="font-dm-regular text-sm text-[#6B7280]">
                  No products found in {categoryName}
                </Text>
              </View>
            }
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    // Exact drop shadow from design spec: box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, 0.12);
    boxShadow: '0px 8px 32px 0px rgba(0, 0, 0, 0.12)',
    shadowColor: colors.semi_transparent_white,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
});
