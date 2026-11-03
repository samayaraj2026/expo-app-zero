import React, { memo, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { FilterIcon, SortIcon } from "@/assets";
import { AppButton, BackButton, SearchTextInput } from "@/components/ui";
import { ProductRowCard } from "@/features/catalogue";
import {
  CATALOGUE_SECTIONS,
  ORDER_AGAIN_PRODUCTS,
  STATIONERY_PRODUCTS,
} from "@/constants/catalogue";
import { useLoadingHaptics } from "@/hooks";
import { colors } from "@/themes/colors";
import type { Product } from "@/types";

const PAGE_SIZE = 8;

const styles = StyleSheet.create({
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },
});

interface CategoryProductListProps {
  products: Product[];
  categoryName: string;
  onProductPress: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const CategoryProductList = memo(function CategoryProductList({
  products,
  categoryName,
  onProductPress,
  onAddToCart,
}: CategoryProductListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Trigger haptic vibration on lazy load start and complete
  useLoadingHaptics(isLoadingMore, {
    vibrateOnStart: true,
    startType: "heavy",
    vibrateOnComplete: true,
    completeType: "heavy",
  });

  // Lazy-loaded visible products slice
  const displayedProducts = useMemo(() => {
    return products.slice(0, visibleCount);
  }, [products, visibleCount]);

  const hasMore = visibleCount < products.length;

  const handleEndReached = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    // Smooth batch load transition
    setTimeout(() => {
      setVisibleCount((previousCount) =>
        Math.min(previousCount + PAGE_SIZE, products.length),
      );
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, hasMore, products.length]);

  const renderProductRowItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductRowCard
        product={item}
        onPress={onProductPress}
        onAddToCart={onAddToCart}
      />
    ),
    [onProductPress, onAddToCart],
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
        <Text className="font-dm-regular text-sm text-neutral500">
          No products found in {categoryName}
        </Text>
      </View>
    ),
    [categoryName],
  );

  return (
    <FlatList
      data={displayedProducts}
      keyExtractor={keyExtractor}
      renderItem={renderProductRowItem}
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
      contentContainerStyle={styles.listContent}
    />
  );
});

export default function CategoryScreen() {
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const categoryName = params.name || "Stationery";
  const categoryId = params.id || "stationery";

  const [searchQuery, setSearchQuery] = useState("");

  // Find products belonging to this category
  const products = useMemo(() => {
    const foundSection = CATALOGUE_SECTIONS.find(
      (section) =>
        section.id === categoryId ||
        section.title.toLowerCase() === categoryName.toLowerCase(),
    );
    if (foundSection) return foundSection.products;
    if (categoryId === "order_again") return ORDER_AGAIN_PRODUCTS;
    return STATIONERY_PRODUCTS;
  }, [categoryId, categoryName]);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(trimmedQuery) ||
        product.supplier.toLowerCase().includes(trimmedQuery) ||
        product.packageInfo.toLowerCase().includes(trimmedQuery),
    );
  }, [products, searchQuery]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/(tabs)/catalogue");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [handleBack]),
  );

  const handleProductPress = useCallback((product: Product) => {
    router.push({
      pathname: "/productdetails",
      params: { id: product.id },
    });
  }, []);

  const handleAddToCart = useCallback(
    (product: Product, quantity: number) => {
      console.log(`Cart: ${product.name} x${quantity}`);
    },
    [],
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          {/* Top Header */}
          <View className="flex-row items-center justify-between px-4 py-2">
            <BackButton onPress={handleBack} />

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
              onClear={handleClearSearch}
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

          <View className="border-b border-border w-full" />

          {/* Filtered Product List with Key-based reset */}
          <CategoryProductList
            key={`${categoryId}-${searchQuery}`}
            products={filteredProducts}
            categoryName={categoryName}
            onProductPress={handleProductPress}
            onAddToCart={handleAddToCart}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
