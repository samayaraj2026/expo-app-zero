import React, { memo } from "react";
import { ScrollView, Text, View } from "react-native";
import { AppButton, SearchTextInput } from "@/components/ui";
import { CATALOGUE_CATEGORIES } from "@/constants/catalogue";

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
      <View className="flex-row items-center gap-2 mb-3">
        <Text className="font-dm-bold text-lg text-black">Products</Text>
        <View className="bg-surface px-2 py-0.5 rounded-md">
          <Text className="font-dm-semibold text-xs text-black">
            {productsCount}
          </Text>
        </View>
      </View>

      {/* Search Bar matching screenshot */}
      <View className="mb-3">
        <SearchTextInput
          placeholder={`Search ${supplierName}`}
          value={searchQuery}
          onChangeText={onSearchChange}
          showClearButton={Boolean(searchQuery)}
          onClear={() => onSearchChange("")}
          showDivider={false}
          rightIcon={null}
          containerStyle={{
            height: 44,
            borderRadius: 12,
            backgroundColor: "#F4F5F7",
            borderWidth: 0,
            paddingHorizontal: 14,
          }}
          inputStyle={{
            fontSize: 14,
            fontFamily: "DMSans_400Regular",
            color: "#111827",
          }}
        />
      </View>

      {/* Category Filter Pills from Catalogue screen */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-2.5 pb-1"
      >
        {CATALOGUE_CATEGORIES.map((cat) => (
                           <AppButton
                             key={cat.id}
                             variant="outline"
                             size="md"
                             label={cat.name}
                             leftIcon={
                               <View className="w-8 h-8 rounded-full bg-surface" />
                             }
                             className="h-[46px] pl-3 pr-4 rounded-2xl"
                             
                           />
                         ))}
      </ScrollView>
    </View>
  );
});

export default SupplierProductFilters;


