import React, { memo, useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Linking, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import ProductRowCard from "@/components/ProductRowCard";
import {
  SupplierAboutSection,
  SupplierHeader,
  SupplierNavBar,
  SupplierProductFilters,
  SupplierReviewsCard,
  SupplierStats,
} from "@/components/supplier";
import {
  DEFAULT_SUPPLIER,
  getSupplierDetails,
  type SupplierDetailsData,
} from "@/constants/supplier";
import type { Product } from "@/types/catalogue";

function SupplierDetailsScreen() {
  const params = useLocalSearchParams<{ supplier?: string; id?: string }>();

  // Fetch or construct supplier profile data
  const supplierData: SupplierDetailsData = useMemo(() => {
    return getSupplierDetails(params.supplier || DEFAULT_SUPPLIER.name);
  }, [params.supplier]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Cart quantity tracking for top pill badge
  const [cartCount, setCartCount] = useState(1);

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    let list = supplierData.products;

    if (selectedCategory) {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.packageInfo?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [supplierData.products, selectedCategory, searchQuery]);

  // Handlers
  const handleProductPress = useCallback((product: Product) => {
    router.push({
      pathname: "/productdetails",
      params: { id: product.id },
    });
  }, []);

  const handleAddToCart = useCallback((_product: Product, qty: number) => {
    setCartCount((prev) => (qty > 0 ? Math.max(1, prev) : prev));
  }, []);

  const handleCopy = useCallback((text: string, label: string) => {
    Alert.alert("Copied to clipboard", `${label}: ${text}`);
  }, []);

  const handleOpenUrl = useCallback((url: string) => {
    const formatted = url.startsWith("http") ? url : `https://${url}`;
    Linking.openURL(formatted).catch(() => {
      Alert.alert("Error", `Could not open ${url}`);
    });
  }, []);

  const handleOpenEmail = useCallback(
    (email: string) => {
      Linking.openURL(`mailto:${email}`).catch(() => {
        handleCopy(email, "Email");
      });
    },
    [handleCopy]
  );

  const handleOpenPhone = useCallback(
    (phone: string) => {
      Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`).catch(() => {
        handleCopy(phone, "Phone");
      });
    },
    [handleCopy]
  );

  // Render header items above the virtualized product list
  const renderListHeader = useCallback(() => {
    return (
      <View className="px-5 pt-2">
        <SupplierHeader
          name={supplierData.name}
          location={supplierData.location}
          verified={supplierData.verified}
        />

        <SupplierStats
          productCount={supplierData.productCount}
          onTimeDeliveryRate={supplierData.onTimeDeliveryRate}
        />

        <SupplierAboutSection
          categories={supplierData.categories}
          email={supplierData.email}
          phone={supplierData.phone}
          website={supplierData.website}
          onOpenEmail={handleOpenEmail}
          onOpenPhone={handleOpenPhone}
          onOpenWebsite={handleOpenUrl}
        />

        <SupplierReviewsCard
          rating={supplierData.rating}
          ratingCount={supplierData.ratingCount}
          ratingBreakdown={supplierData.ratingBreakdown}
        />

        {/* Section Divider */}
        <View className="h-2 bg-surface -mx-5 mt-6 mb-5" />

        <SupplierProductFilters
          productsCount={supplierData.productsCount}
          supplierName={supplierData.name}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilters={supplierData.categoryFilters}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>
    );
  }, [
    supplierData,
    searchQuery,
    selectedCategory,
    handleOpenEmail,
    handleOpenPhone,
    handleOpenUrl,
  ]);

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <View className="px-5">
        <ProductRowCard
          product={item}
          onPress={handleProductPress}
          onAddToCart={handleAddToCart}
        />
      </View>
    ),
    [handleProductPress, handleAddToCart]
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SupplierNavBar cartCount={cartCount} />

      <FlatList
        data={filteredProducts}
        keyExtractor={keyExtractor}
        renderItem={renderProductItem}
        ListHeaderComponent={renderListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-16"
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        ListEmptyComponent={
          <View className="items-center justify-center py-12 px-5">
            <Text className="font-dm-regular text-sm text-black70 text-center">
              No products found matching &quot;{searchQuery}&quot;
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

export default memo(SupplierDetailsScreen);
