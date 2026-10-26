import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { AppButton, BackButton, SearchTextInput } from "@/components/ui";
import { FilterIcon, SortIcon } from "@/assets";
import {
  CATALOGUE_SECTIONS,
  ORDER_AGAIN_PRODUCTS,
  STATIONERY_PRODUCTS,
} from "@/constants/catalogue";
import { colors } from "@/themes/colors";
import type { Product } from "@/types";
import ProductRowCard from "@/components/ProductRowCard";

const PAGE_SIZE = 8;

export default function CategoryScreen() {
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const categoryName = params.name || "Stationery";
  const categoryId = params.id || "stationery";

  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [prevFilterKey, setPrevFilterKey] = useState(
    `${categoryId}_${searchQuery}`,
  );
  const currentFilterKey = `${categoryId}_${searchQuery}`;

  // Reset pagination during render when category or search query changes
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleCount(PAGE_SIZE);
    setIsLoadingMore(false);
  }

  // Find products belonging to this category
  const products = useMemo(() => {
    const foundSection = CATALOGUE_SECTIONS.find(
      (s) =>
        s.id === categoryId ||
        s.title.toLowerCase() === categoryName.toLowerCase(),
    );
    if (foundSection) return foundSection.products;
    if (categoryId === "order_again") return ORDER_AGAIN_PRODUCTS;
    return STATIONERY_PRODUCTS;
  }, [categoryId, categoryName]);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q) ||
        p.packageInfo.toLowerCase().includes(q),
    );
  }, [products, searchQuery]);

  // Lazy-loaded visible products slice
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  const handleEndReached = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    // Smooth batch load transition
    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + PAGE_SIZE, filteredProducts.length),
      );
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, hasMore, filteredProducts.length]);

  const handleProductPress = useCallback((product: Product) => {
    router.push({
      pathname: "/productdetails",
      params: { id: product.id },
    });
  }, []);

  const handleAddToCart = useCallback((product: Product, qty: number) => {
    console.log(`Cart: ${product.name} x${qty}`);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductRowCard
        product={item}
        onPress={handleProductPress}
        onAddToCart={handleAddToCart}
      />
    ),
    [handleProductPress, handleAddToCart],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isLoadingMore]);

  const renderEmpty = useCallback(
    () => (
      <View className="items-center justify-center py-16">
        <Text className="font-dm-regular text-sm text-[#6B7280]">
          No products found in {categoryName}
        </Text>
      </View>
    ),
    [categoryName],
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          {/* Top Header */}
          <View className="flex-row items-center justify-between px-4 py-2">
            <BackButton />

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
              onClear={() => setSearchQuery("")}
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
              icon={<FilterIcon width={16} height={16} stroke={colors.black} />}
              onPress={() => {}}
            />
          </View>

          {/* Subtle Divider */}
          <View className="border-b border-border w-full" />

          {/* Vertical Product List with Optimized Lazy Loading */}
          <FlatList
            data={displayedProducts}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={7}
            updateCellsBatchingPeriod={50}
            removeClippedSubviews={Platform.OS === "android"}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 20,
              paddingBottom: 120, // Breathing space so last item floats above the tab bar
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
