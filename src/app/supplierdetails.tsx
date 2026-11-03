import React, { memo, useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Linking, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  SupplierAboutSection,
  SupplierHeader,
  SupplierNavBar,
  SupplierProductCard,
  SupplierProductFilters,
  SupplierReviewsCard,
  SupplierStats,
} from "@/features/suppliers";
import {
  DEFAULT_SUPPLIER,
  getSupplierDetails,
  type SupplierDetailsData,
} from "@/constants/supplier";
import type { Product } from "@/types/catalogue";

const SupplierOverview = memo(function SupplierOverview({
  supplierData,
  onOpenEmail,
  onOpenPhone,
  onOpenWebsite,
}: {
  supplierData: SupplierDetailsData;
  onOpenEmail: (email: string) => void;
  onOpenPhone: (phone: string) => void;
  onOpenWebsite: (url: string) => void;
}) {
  return (
    <View>
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
        onOpenEmail={onOpenEmail}
        onOpenPhone={onOpenPhone}
        onOpenWebsite={onOpenWebsite}
      />

      <SupplierReviewsCard
        rating={supplierData.rating}
        ratingCount={supplierData.ratingCount}
        ratingBreakdown={supplierData.ratingBreakdown}
      />

      {/* Section Divider */}
      <View className="h-2 bg-surface -mx-5 mt-6 mb-5" />
    </View>
  );
});

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
    let productList = supplierData.products;

    if (selectedCategory) {
      productList = productList.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery) {
      productList = productList.filter(
        (product) =>
          product.name.toLowerCase().includes(trimmedQuery) ||
          product.category.toLowerCase().includes(trimmedQuery) ||
          product.packageInfo?.toLowerCase().includes(trimmedQuery),
      );
    }

    return productList;
  }, [supplierData.products, selectedCategory, searchQuery]);

  // Handlers
  const handleProductPress = useCallback((product: Product) => {
    router.push({
      pathname: "/productdetails",
      params: { id: product.id },
    });
  }, []);

  const handleAddToCart = useCallback(
    (product: Product, quantity: number) => {
      setCartCount((previousCount) =>
        quantity > 0 ? Math.max(1, previousCount) : previousCount,
      );
    },
    [],
  );

  const handleCopyText = useCallback((text: string, label: string) => {
    Alert.alert("Copied to clipboard", `${label}: ${text}`);
  }, []);

  const handleOpenUrl = useCallback((url: string) => {
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    Linking.openURL(formattedUrl).catch(() => {
      Alert.alert("Error", `Could not open ${url}`);
    });
  }, []);

  const handleOpenEmail = useCallback(
    (email: string) => {
      Linking.openURL(`mailto:${email}`).catch(() => {
        handleCopyText(email, "Email");
      });
    },
    [handleCopyText],
  );

  const handleOpenPhone = useCallback(
    (phone: string) => {
      Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`).catch(() => {
        handleCopyText(phone, "Phone");
      });
    },
    [handleCopyText],
  );

  // Render header items above the virtualized product list
  const renderListHeader = useCallback(() => {
    return (
      <View className="px-5 pt-2">
        <SupplierOverview
          supplierData={supplierData}
          onOpenEmail={handleOpenEmail}
          onOpenPhone={handleOpenPhone}
          onOpenWebsite={handleOpenUrl}
        />

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
        <SupplierProductCard
          product={item}
          onPress={handleProductPress}
          onAddToCart={handleAddToCart}
        />
      </View>
    ),
    [handleProductPress, handleAddToCart],
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
        maxToRenderPerBatch={6}
        windowSize={7}
      />
    </SafeAreaView>
  );
}

export default memo(SupplierDetailsScreen);
