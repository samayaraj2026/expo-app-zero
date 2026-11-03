import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Carousel } from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import {
  ConfirmedIcon,
  NextIcon,
  OutofStockIcon,
  StarIcon,
} from "@/assets";
import { AppButton, BackButton, SearchCartPill } from "@/components/ui";
import { VariantCard } from "@/features/catalogue";
import { getProductDetails } from "@/constants/catalogue";
import { colors } from "@/themes/colors";
import type { ProductDetailsData, ProductVariant } from "@/types/catalogue";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function ProductDetailsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();

  // Fetch product data from store or API contract
  const product: ProductDetailsData = useMemo(() => {
    return getProductDetails(params.id);
  }, [params.id]);

  // Selected variant state (defaults to first variant)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0],
  );

  // Active carousel image index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Cart quantity state (0 = "Add to cart", >0 = Stepper)
  const [quantity, setQuantity] = useState(0);

  const handleVariantSelect = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
    // Reset quantity if switching to an out-of-stock variant
    if (!variant.inStock) {
      setQuantity(0);
    }
  }, []);

  const renderVariantItem = useCallback(
    ({ item }: { item: ProductVariant }) => (
      <VariantCard
        variant={item}
        isSelected={item.id === selectedVariant.id}
        currency={product.currency}
        onSelect={handleVariantSelect}
      />
    ),
    [selectedVariant.id, product.currency, handleVariantSelect],
  );

  const keyExtractorVariant = useCallback((item: ProductVariant) => item.id, []);

  const handleCarouselSnap = useCallback((index: number) => {
    setActiveImageIndex(index);
  }, []);

  const renderCarouselItem = useCallback(
    ({ item }: { item: string }) => (
      <View
        style={{
          width: SCREEN_WIDTH,
          height: 260,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          backgroundColor: colors.surface,
        }}
      >
        <Image
          source={{ uri: item }}
          style={styles.carouselImage}
          contentFit="contain"
          transition={250}
        />
      </View>
    ),
    [],
  );

  const handleSupplierPress = useCallback(() => {
    router.push({
      pathname: "/supplierdetails",
      params: {
        id: product.id,
        supplier: product.supplier,
      },
    });
  }, [product.id, product.supplier]);

  const handleAddToCart = useCallback(() => {
    setQuantity(1);
  }, []);

  const handleQuantityChange = useCallback((nextQuantity: number) => {
    setQuantity(nextQuantity);
  }, []);

  const handleEmptyPress = useCallback(() => {}, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.surface }}
      edges={["top"]}
    >
      <StatusBar style="dark" />

      {/* Top Header Navigation Bar */}
      <View
        className="flex-row items-center justify-between px-5 w-full z-20"
        style={styles.headerBar}
      >
        <BackButton style={styles.headerBackButton} />

        {/* Right Search & Cart Pill */}
        <SearchCartPill />
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.white }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Carousel Section */}
        <View
          style={{
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 4,
            paddingBottom: 10,
          }}
        >
          <Carousel
            data={product.images}
            itemSize={SCREEN_WIDTH}
            style={{
              width: SCREEN_WIDTH,
              height: 260,
              backgroundColor: colors.surface,
            }}
            loop={false}
            onSnapToItem={handleCarouselSnap}
            renderItem={renderCarouselItem}
          />

          {/* Carousel Pagination Dots */}
          <View className="flex-row items-center justify-center gap-1.5 mt-9">
            {product.images.map((_, dotIndex) => (
              <View
                key={`dot-${dotIndex}`}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor:
                    dotIndex === activeImageIndex
                      ? colors.primary
                      : colors.carousel_dot,
                }}
              />
            ))}
          </View>
        </View>

        {/* Product Content Card */}
        <View style={{ backgroundColor: colors.white, flex: 1 }}>
          {/* Product Info & Pricing */}
          <View className="px-4 pt-5">
            {/* Category & Rating Row */}
            <View className="flex-row items-center justify-between">
              <Text className="font-dm-regular text-sm text-content_default_secondary">
                {product.category}
              </Text>

              <View className="flex-row items-center gap-1">
                <StarIcon width={13.31} height={12.66} />
                <Text className="font-dm-bold text-xsm text-black">
                  {product.rating.toFixed(1)}
                </Text>
                <Text className="font-dm-regular text-xsm text-content_default_secondary">
                  ({product.ratingCount})
                </Text>
              </View>
            </View>

            {/* Product Title */}
            <Text className="font-dm-semibold text-base text-black leading-7 mt-1.5">
              {product.name}
            </Text>

            {/* Supplier Link */}
            <AppButton
              variant="ghost"
              label={product.supplier}
              rightIcon={<NextIcon width={6} height={10} />}
              onPress={handleSupplierPress}
              className="mt-0.5 self-start px-0 py-0"
              style={styles.supplierButton}
              textStyle={styles.supplierText}
            />

            {/* Price & Discount */}
            <View className="flex-row items-baseline mt-4">
              <Text className="font-dm-semibold text-xl text-black">
                {product.currency}
                {selectedVariant.price.toFixed(2)}
              </Text>
              {selectedVariant.originalPrice ? (
                <Text className="font-dm-regular text-sm text-Content_Default_Disabled line-through ml-2">
                  {product.currency}
                  {selectedVariant.originalPrice.toFixed(2)}
                </Text>
              ) : null}
            </View>
            <Text className="font-dm-regular text-xsm text-content_default_secondary mt-0.5">
              Excludes VAT
            </Text>

            {/* Divider */}
            <View className="h-[1px] bg-border mt-5 mb-4" />

            {/* 5 Variants Horizontal FlatList */}
            <View>
              <Text className="font-dm-medium text-xsm text-black mb-1">
                Variant
              </Text>

              <FlatList
                horizontal
                data={product.variants}
                keyExtractor={keyExtractorVariant}
                renderItem={renderVariantItem}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            {/* Divider */}
            <View className="h-[8px] bg-surface mt-5 mb-4" style={{ marginHorizontal: -24 }} />

            {/* Stock Status Section */}
            <View className="flex-row items-center gap-3 py-1">
              {selectedVariant.inStock ? (
                <>
                  <ConfirmedIcon width={18} height={18} />
                  <View>
                    <Text className="font-dm-semibold text-base text-black">
                      In stock
                    </Text>
                    <Text className="font-dm-regular text-sm text-content_default_secondary">
                      {product.deliveryEstimate}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <OutofStockIcon width={18} height={18} />
                  <View>
                    <Text className="font-dm-semibold text-base text-black">
                      Out of stock
                    </Text>
                    <Text className="font-dm-regular text-xs text-content_default_secondary">
                      Check back later
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-border mt-5 mb-4" />

            {/* About This Product */}
            <View className="mt-1">
              <Text className="font-dm-semibold text-base text-black mb-1">
                About this product
              </Text>
              <Text className="font-dm-regular text-sm text-content_default_secondary leading-5">
                {product.about}
              </Text>
            </View>

            {/* Details Card */}
            <View className="bg-surface rounded-xl p-4 mt-6">
              <Text className="font-dm-semibold text-base text-black mb-3">
                Details
              </Text>

              <View className="h-[1px] bg-border mb-3" />

              <View className="gap-2">
                <View className="flex-row justify-between items-center py-1">
                  <Text className="font-dm-medium text-sm text-black">
                    Product code
                  </Text>
                  <Text className="font-dm-regular text-sm text-content_default_secondary">
                    {selectedVariant.productCode}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center py-1">
                  <Text className="font-dm-medium text-sm text-black">
                    Size
                  </Text>
                  <Text className="font-dm-regular text-sm text-content_default_secondary">
                    {selectedVariant.size || product.details.size}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center py-1">
                  <Text className="font-dm-medium text-sm text-black">
                    Weight
                  </Text>
                  <Text className="font-dm-regular text-sm text-content_default_secondary">
                    {selectedVariant.weight || product.details.weight}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center py-1">
                  <Text className="font-dm-medium text-sm text-black">
                    Colour
                  </Text>
                  <Text className="font-dm-regular text-sm text-content_default_secondary">
                    {selectedVariant.colour || product.details.colour}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center py-1">
                  <Text className="font-dm-medium text-sm text-black">
                    Sheets per ream
                  </Text>
                  <Text className="font-dm-regular text-sm text-content_default_secondary">
                    {selectedVariant.sheetsPerReam ||
                      product.details.sheetsPerReam}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            height: Math.max(98, 64 + insets.bottom),
            paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
            paddingTop: insets.bottom > 0 ? 8 : 12,
          },
        ]}
      >
        {/* Price & VAT */}
        <View>
          <View className="flex-row items-baseline">
            <Text className="font-dm-semibold text-sm text-black">
              {product.currency}
              {selectedVariant.price.toFixed(2)}
            </Text>
            {selectedVariant.originalPrice ? (
              <Text className="font-dm-medium text-sm text-Content_Default_Disabled line-through ml-1">
                {product.currency}
                {selectedVariant.originalPrice.toFixed(2)}
              </Text>
            ) : null}
          </View>
          <Text className="font-dm-regular text-xsm text-content_default_secondary">
            Excludes VAT
          </Text>
        </View>

        {/* Action Button: Add to Cart / Stepper / Out of Stock */}
        <View style={styles.actionButtonContainer}>
          {!selectedVariant.inStock ? (
            <AppButton
              variant="outline"
              size="md"
              disabled
              label="Out of stock"
              onPress={handleEmptyPress}
              style={styles.outOfStockButton}
            />
          ) : quantity === 0 ? (
            <AppButton
              variant="solid"
              size="md"
              label="Add to cart"
              onPress={handleAddToCart}
              style={styles.addToCartButton}
            />
          ) : (
            <AppButton
              variant="stepper"
              size="md"
              value={quantity}
              onValueChange={handleQuantityChange}
              style={styles.stepperButton}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default memo(ProductDetailsScreen);

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: colors.surface,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerBackButton: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  carouselImage: {
    width: 246,
    height: 200,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  supplierButton: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  supplierText: {
    color: colors.blue,
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 98,
    backgroundColor: colors.white,
    boxShadow: "0px 8px 32px 0px rgba(0, 0, 0, 0.12)",
    shadowColor: colors.semi_transparent_white,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  actionButtonContainer: {
    alignItems: "flex-end",
  },
  addToCartButton: {
    width: 156,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperButton: {
    width: 156,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  outOfStockButton: {
    width: 156,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderColor: colors.zinc200,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
