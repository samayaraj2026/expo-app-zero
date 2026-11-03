import React, { memo, useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppButton, SearchTextInput } from "@/components/ui";
import { ProductCard, ProductSection } from "@/features/catalogue";
import {
  CATALOGUE_CATEGORIES,
  CATALOGUE_SECTIONS,
  ORDER_AGAIN_PRODUCTS,
} from "@/constants/catalogue";
import { colors } from "@/themes/colors";
import type { Category, Product } from "@/types";

const CategoryPill = memo(function CategoryPill({
  category,
  onPress,
}: {
  category: Category;
  onPress: (id: string, name: string) => void;
}) {
  const handlePress = useCallback(() => {
    onPress(category.id, category.name);
  }, [category.id, category.name, onPress]);

  return (
    <AppButton
      variant="outline"
      size="md"
      label={category.name}
      leftIcon={<View style={styles.categoryIconPlaceholder} />}
      className="h-[46px] pl-3 pr-4 rounded-2xl"
      onPress={handlePress}
    />
  );
});

export default function CatalogueScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products when search query is entered
  const filteredSearchResults = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return null;

    const allProducts = CATALOGUE_SECTIONS.flatMap(
      (section) => section.products,
    );
    const seenProductIds = new Set<string>();

    return allProducts.filter((product) => {
      if (seenProductIds.has(product.id)) return false;
      seenProductIds.add(product.id);
      return (
        product.name.toLowerCase().includes(trimmedQuery) ||
        product.category.toLowerCase().includes(trimmedQuery) ||
        product.supplier.toLowerCase().includes(trimmedQuery)
      );
    });
  }, [searchQuery]);

  const handleSeeAll = useCallback(
    (sectionId: string, sectionTitle?: string) => {
      const displayTitle =
        sectionTitle || (sectionId === "order_again" ? "Order again" : sectionId);
      router.push({
        pathname: "/(tabs)/category",
        params: { id: sectionId, name: displayTitle },
      });
    },
    [],
  );

  const handleProductPress = useCallback((product: Product) => {
    router.push({
      pathname: "/productdetails",
      params: { id: product.id },
    });
  }, []);

  const handleAddToCart = useCallback(
    (product: Product, quantity: number) => {
      console.log(`Cart updated: ${product.name} x${quantity}`);
    },
    [],
  );

  const handleCategoryPress = useCallback(
    (categoryId: string, categoryName: string) => {
      router.push({
        pathname: "/(tabs)/category",
        params: { id: categoryId, name: categoryName },
      });
    },
    [],
  );

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={handleProductPress}
        onAddToCart={handleAddToCart}
      />
    ),
    [handleProductPress, handleAddToCart],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const nonOrderAgainSections = useMemo(
    () => CATALOGUE_SECTIONS.filter((section) => section.id !== "order_again"),
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          {/* Top Search Input */}
          <View className="px-5 pt-2 pb-6 bg-white">
            <SearchTextInput
              placeholder="Search all product"
              value={searchQuery}
              onChangeText={setSearchQuery}
              showClearButton={Boolean(searchQuery)}
              onClear={handleClearSearch}
            />
          </View>

          {/* Search Results or Full Catalogue */}
          {filteredSearchResults !== null ? (
            <View className="flex-1 px-5 pt-2">
              <Text className="font-dm-bold text-[16px] text-black mb-3">
                Search Results ({filteredSearchResults.length})
              </Text>
              {filteredSearchResults.length === 0 ? (
                <View className="items-center justify-center py-12">
                  <Text className="font-dm-regular text-sm text-neutral500">
                    No products found for &quot;{searchQuery}&quot;
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredSearchResults}
                  keyExtractor={keyExtractor}
                  numColumns={2}
                  columnWrapperStyle={styles.columnWrapper}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.searchResultsContainer}
                  renderItem={renderProductItem}
                />
              )}
            </View>
          ) : (
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              contentInsetAdjustmentBehavior="automatic"
            >
              {/* 1. Order Again Section */}
              <ProductSection
                title="Order again"
                products={ORDER_AGAIN_PRODUCTS}
                onSeeAll={() => handleSeeAll("order_again")}
                onProductPress={handleProductPress}
                onAddToCart={handleAddToCart}
              />

              {/* 2. Categories Section */}
              <View className="mb-6 px-5">
                <Text className="font-dm-bold text-2xl text-black mb-3">
                  Categories
                </Text>
                <View className="flex-row flex-wrap gap-2.5">
                  {CATALOGUE_CATEGORIES.map((category) => (
                    <CategoryPill
                      key={category.id}
                      category={category}
                      onPress={handleCategoryPress}
                    />
                  ))}
                </View>
              </View>

              {/* 3. Category Sections */}
              {nonOrderAgainSections.map((section) => (
                <ProductSection
                  key={section.id}
                  title={section.title}
                  products={section.products}
                  onSeeAll={() => handleSeeAll(section.id, section.title)}
                  onProductPress={handleProductPress}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  categoryIconPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  columnWrapper: {
    justifyContent: "space-around",
    marginBottom: 16,
  },
  searchResultsContainer: {
    paddingBottom: 110,
  },
  scrollContainer: {
    paddingBottom: 110,
  },
});
