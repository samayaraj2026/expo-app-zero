import React, { memo, useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton, SearchTextInput } from "@/components/ui";
import { CATALOGUE_CATEGORIES } from "@/constants/catalogue";
import { colors } from "@/themes/colors";
import type { Category } from "@/types";

export interface SupplierProductFiltersProps {
  productsCount: number;
  supplierName: string;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  categoryFilters: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const FilterCategoryPill = memo(function FilterCategoryPill({
  category,
  isSelected,
  onPress,
}: {
  category: Category;
  isSelected: boolean;
  onPress?: (categoryName: string) => void;
}) {
  const handlePress = useCallback(() => {
    onPress?.(category.name);
  }, [category.name, onPress]);

  return (
    <AppButton
      variant={isSelected ? "solid" : "outline"}
      size="md"
      label={category.name}
      leftIcon={<View style={styles.pillIconPlaceholder} />}
      className="h-[46px] pl-3 pr-4 rounded-2xl"
      onPress={handlePress}
    />
  );
});

export const SupplierProductFilters = memo(function SupplierProductFilters({
  productsCount,
  supplierName,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}: SupplierProductFiltersProps) {
  const handleClearSearch = useCallback(() => {
    onSearchChange("");
  }, [onSearchChange]);

  const handleSelectCategory = useCallback(
    (categoryName: string) => {
      onSelectCategory(
        selectedCategory === categoryName ? null : categoryName,
      );
    },
    [selectedCategory, onSelectCategory],
  );

  return (
    <View className="mb-4">
      {/* Products Heading & Count Badge */}
      <View className="flex-row items-center gap-2 mb-3">
        <Text className="font-dm-bold text-lg text-black">Products</Text>
        <View className="bg-surface px-2 py-0.5 rounded-md">
          <Text className="font-dm-semibold text-xs text-black">
            {productsCount}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="mb-3">
        <SearchTextInput
          placeholder={`Search ${supplierName}`}
          value={searchQuery}
          onChangeText={onSearchChange}
          showClearButton={Boolean(searchQuery)}
          onClear={handleClearSearch}
          showDivider={false}
          rightIcon={null}
          containerStyle={styles.searchContainer}
          inputStyle={styles.searchInput}
        />
      </View>

      {/* Category Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-2.5 pb-1"
      >
        {CATALOGUE_CATEGORIES.map((category) => (
          <FilterCategoryPill
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.name}
            onPress={handleSelectCategory}
          />
        ))}
      </ScrollView>
    </View>
  );
});

export default SupplierProductFilters;

const styles = StyleSheet.create({
  searchContainer: {
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 0,
    paddingHorizontal: 14,
  },
  searchInput: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: colors.primary,
  },
  pillIconPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
});
