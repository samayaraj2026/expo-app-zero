import React, { memo } from "react";
import { ScrollView, Text, View } from "react-native";
import { AppButton, SearchTextInput } from "@/components/ui";

export interface SupplierProductFiltersProps {
  productsCount: number;
  supplierName: string;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  categoryFilters: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const SupplierProductFilters = memo(function SupplierProductFilters({
  productsCount,
  supplierName,
  searchQuery,
  onSearchChange,
  categoryFilters,
  selectedCategory,
  onSelectCategory,
}: SupplierProductFiltersProps) {
  return (
    <View className="mb-4">
      {/* Products Heading & Count Badge */}
      <View className="flex-row items-center gap-2 mb-3.5">
        <Text className="font-dm-bold text-lg text-black">Products</Text>
        <View className="bg-surface px-2.5 py-1 rounded-lg">
          <Text className="font-dm-semibold text-xs text-black">
            {productsCount}
          </Text>
        </View>
      </View>

      {/* Reusable Search Bar */}
      <View className="mb-3.5">
        <SearchTextInput
          placeholder={`Search ${supplierName}`}
          value={searchQuery}
          onChangeText={onSearchChange}
          showClearButton={Boolean(searchQuery)}
          onClear={() => onSearchChange("")}
        />
      </View>

      {/* Reusable Category Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-2"
      >
        {categoryFilters.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <AppButton
              key={category}
              variant= "outline"
              size="md"
              label={category}
              leftIcon={
                <View
                  className={`w-2.5 h-2.5 rounded-full ${
                    isSelected ? "bg-blue-300" : "bg-gray/30"
                  }`}
                />
              }
              className={
                isSelected
                  ? "rounded-full px-3.5 py-2"
                  : "rounded-full px-3.5 py-2 border-border/60 bg-white"
              }
              textClassName={
                isSelected
                  ? "text-white font-dm-semibold text-xs"
                  : "text-black70 font-dm-medium text-xs"
              }
              onPress={() => onSelectCategory(isSelected ? null : category)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
});

export default SupplierProductFilters;
