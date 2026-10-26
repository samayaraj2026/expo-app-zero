import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Carousel } from "react-native-reanimated-carousel";
import Svg, { Circle, Path } from "react-native-svg";
import { AppButton, BackButton } from "@/components/ui";
import { CartIcon, NextIcon, SearchIcon } from "@/assets";
import { getProductDetails } from "@/constants/catalogue";
import { colors } from "@/themes/colors";
import type { ProductDetailsData, ProductVariant } from "@/types/catalogue";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function InStockIcon({
  width = 22,
  height = 22,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#18181B" strokeWidth="1.5" />
      <Path
        d="M8.5 12.5L10.5 14.5L15.5 9.5"
        stroke="#18181B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function OutOfStockIcon({
  width = 24,
  height = 24,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 7.5L12 2.5L3 7.5V16.5L12 21.5L21 16.5V7.5Z"
        stroke="#18181B"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Path
        d="M3.5 7.7L12 12.5L20.5 7.7"
        stroke="#18181B"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Path d="M12 12.5V21.5" stroke="#18181B" strokeWidth="1.5" />
      <Path
        d="M9 13.5L12 16.5M12 13.5L9 16.5"
        stroke="#18181B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ─── Main Product Details Screen ──────────────────────────────────────────────
function ProductDetailsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();

  // Fetch product data from mock store or API contract
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

  const carouselItemWidth = SCREEN_WIDTH;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* ── Top Header Navigation Bar ── */}
      <View
        className="flex-row items-center justify-between px-5 w-full z-20"
        style={{ paddingTop: 8, paddingBottom: 10 }}
      >
        <BackButton />

        {/* Right Search & Cart Pill */}
        <View style={styles.topRightPill}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/catalogue")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <SearchIcon width={18} height={18} stroke="#000000" />
          </TouchableOpacity>

          <View style={styles.pillDivider} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/cart")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ position: "relative" }}
          >
            <CartIcon width={20} height={20} stroke="#000000" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* ── Image Carousel Section ── */}
        <View className="items-center justify-center bg-white pt-2 pb-2">
          <Carousel
            data={product.images}
            itemSize={carouselItemWidth}
            style={{
              width: carouselItemWidth,
              height: 274,
              backgroundColor: colors.surface,
            }}
            loop={false}
            onSnapToItem={(index) => setActiveImageIndex(index)}
            renderItem={({ item }) => (
              <View
                style={{
                  width: carouselItemWidth,
                  height: 260,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 24,
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: "85%", height: 230 }}
                  contentFit="contain"
                  transition={250}
                />
              </View>
            )}
          />

          {/* Carousel Pagination Dots */}
          <View className="flex-row items-center justify-center gap-1.5 mt-3">
            {product.images.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === activeImageIndex ? 6 : 5,
                  height: i === activeImageIndex ? 6 : 5,
                  borderRadius: 3,
                  backgroundColor:
                    i === activeImageIndex ? "#1E293B" : "#CBD5E1",
                }}
              />
            ))}
          </View>
        </View>

        {/* ── Product Info & Pricing ── */}
        <View className="px-5 pt-3">
          {/* Category & Rating Row */}
          <View className="flex-row items-center justify-between">
            <Text className="font-dm-regular text-sm text-[#6B7280]">
              {product.category}
            </Text>

            <View className="flex-row items-center gap-1">
              <Text className="text-[#F59E0B] text-xs">★</Text>
              <Text className="font-dm-bold text-xs text-black">
                {product.rating.toFixed(1)}
              </Text>
              <Text className="font-dm-regular text-xs text-[#6B7280]">
                ({product.ratingCount})
              </Text>
            </View>
          </View>

          {/* Product Title */}
          <Text className="font-dm-bold text-[22px] text-black leading-7 mt-1.5">
            {product.name}
          </Text>

          {/* Supplier Link */}
          <AppButton
            variant="ghost"
            label={product.supplier}
            rightIcon={<NextIcon width={6} height={10} stroke="#1D4ED8" />}
            onPress={() => {}}
            className="mt-1.5 self-start px-0 py-0"
            style={{ paddingHorizontal: 0, paddingVertical: 0 }}
            textStyle={{
              color: "#1D4ED8",
              fontSize: 14,
              fontFamily: "DMSans_500Medium",
            }}
          />

          {/* Price & Discount */}
          <View className="flex-row items-baseline mt-3.5">
            <Text className="font-dm-bold text-2xl text-black">
              {product.currency}
              {selectedVariant.price.toFixed(2)}
            </Text>
            {selectedVariant.originalPrice ? (
              <Text className="font-dm-regular text-sm text-[#9CA3AF] line-through ml-2">
                {product.currency}
                {selectedVariant.originalPrice.toFixed(2)}
              </Text>
            ) : null}
          </View>
          <Text className="font-dm-regular text-xs text-[#6B7280] mt-0.5">
            Excludes VAT
          </Text>

          {/* Divider */}
          <View className="h-[1px] bg-[#F3F4F6] mt-4 mb-4" />

          {/* ── 5 Variants Horizontal Scroll ── */}
          <View>
            <Text className="font-dm-medium text-sm text-black mb-3">
              Variant
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {product.variants.map((variant) => {
                const isSelected = variant.id === selectedVariant.id;
                return (
                  <TouchableOpacity
                    key={variant.id}
                    activeOpacity={0.8}
                    onPress={() => handleVariantSelect(variant)}
                    style={[
                      styles.variantCard,
                      isSelected
                        ? styles.variantCardSelected
                        : styles.variantCardUnselected,
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      className="font-dm-semibold text-[13px] text-black"
                    >
                      {variant.title}
                    </Text>
                    <Text
                      numberOfLines={1}
                      className="font-dm-regular text-[11px] text-[#6B7280] mt-1"
                    >
                      {variant.subtitle}
                    </Text>
                    <View className="flex-row items-baseline mt-3">
                      <Text className="font-dm-bold text-[14px] text-black">
                        {product.currency}
                        {variant.price.toFixed(2)}
                      </Text>
                      {variant.originalPrice ? (
                        <Text className="font-dm-regular text-[11px] text-[#9CA3AF] line-through ml-1">
                          {product.currency}
                          {variant.originalPrice.toFixed(2)}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-[#F3F4F6] mt-5 mb-4" />

          {/* ── Stock Status Section ── */}
          <View className="flex-row items-center gap-3 py-1">
            {selectedVariant.inStock ? (
              <>
                <InStockIcon width={22} height={22} />
                <View>
                  <Text className="font-dm-semibold text-[15px] text-black">
                    In stock
                  </Text>
                  <Text className="font-dm-regular text-xs text-[#6B7280] mt-0.5">
                    {product.deliveryEstimate}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <OutOfStockIcon width={24} height={24} />
                <View>
                  <Text className="font-dm-semibold text-[15px] text-black">
                    Out of stock
                  </Text>
                  <Text className="font-dm-regular text-xs text-[#6B7280] mt-0.5">
                    Check back later
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-[#F3F4F6] mt-4 mb-4" />

          {/* ── About This Product ── */}
          <View className="mt-1">
            <Text className="font-dm-bold text-base text-black mb-2">
              About this product
            </Text>
            <Text className="font-dm-regular text-sm text-[#4B5563] leading-5">
              {product.about}
            </Text>
          </View>

          {/* ── Details Card ── */}
          <View className="bg-[#F8F9FA] rounded-2xl p-4 mt-5">
            <Text className="font-dm-bold text-base text-black mb-3">
              Details
            </Text>

            <View className="gap-2.5">
              <View className="flex-row justify-between items-center py-1 border-b border-[#F0F1F3]">
                <Text className="font-dm-medium text-[13px] text-black">
                  Product code
                </Text>
                <Text className="font-dm-regular text-[13px] text-[#6B7280]">
                  {selectedVariant.productCode}
                </Text>
              </View>
              <View className="flex-row justify-between items-center py-1 border-b border-[#F0F1F3]">
                <Text className="font-dm-medium text-[13px] text-black">
                  Size
                </Text>
                <Text className="font-dm-regular text-[13px] text-[#6B7280]">
                  {selectedVariant.size || product.details.size}
                </Text>
              </View>
              <View className="flex-row justify-between items-center py-1 border-b border-[#F0F1F3]">
                <Text className="font-dm-medium text-[13px] text-black">
                  Weight
                </Text>
                <Text className="font-dm-regular text-[13px] text-[#6B7280]">
                  {selectedVariant.weight || product.details.weight}
                </Text>
              </View>
              <View className="flex-row justify-between items-center py-1 border-b border-[#F0F1F3]">
                <Text className="font-dm-medium text-[13px] text-black">
                  Colour
                </Text>
                <Text className="font-dm-regular text-[13px] text-[#6B7280]">
                  {selectedVariant.colour || product.details.colour}
                </Text>
              </View>
              <View className="flex-row justify-between items-center py-1">
                <Text className="font-dm-medium text-[13px] text-black">
                  Sheets per ream
                </Text>
                <Text className="font-dm-regular text-[13px] text-[#6B7280]">
                  {selectedVariant.sheetsPerReam ||
                    product.details.sheetsPerReam}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Fixed Bottom Action Bar ── */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        {/* Price & VAT */}
        <View>
          <View className="flex-row items-baseline">
            <Text className="font-dm-bold text-xl text-black">
              {product.currency}
              {selectedVariant.price.toFixed(2)}
            </Text>
            {selectedVariant.originalPrice ? (
              <Text className="font-dm-regular text-xs text-[#9CA3AF] line-through ml-1.5">
                {product.currency}
                {selectedVariant.originalPrice.toFixed(2)}
              </Text>
            ) : null}
          </View>
          <Text className="font-dm-regular text-xs text-[#6B7280] mt-0.5">
            Excludes VAT
          </Text>
        </View>

        {/* Action Button: Add to Cart / Stepper / Out of Stock */}
        <View style={styles.actionButtonContainer}>
          {!selectedVariant.inStock ? (
            /* State 3: Out of stock (Image 3) */
            <AppButton
              variant="outline"
              size="md"
              disabled
              label="Out of stock"
              onPress={() => {}}
              style={styles.outOfStockButton}
            />
          ) : quantity === 0 ? (
            /* State 1: In stock Add to Cart (Image 1) */
            <AppButton
              variant="solid"
              size="md"
              label="Add to cart"
              onPress={() => setQuantity(1)}
              style={styles.addToCartButton}
            />
          ) : (
            /* State 2: Stepper (Image 2) */
            <AppButton
              variant="stepper"
              size="md"
              value={quantity}
              onValueChange={(val) => setQuantity(val)}
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
  topRightPill: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    boxShadow: "0px 8px 32px 0px rgba(0, 0, 0, 0.12)",
    shadowColor: colors.semi_transparent_white,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
    gap: 14,
  },
  pillDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#F3F4F6",
  },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#EF4444",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "DMSans_700Bold",
    lineHeight: 12,
  },
  variantCard: {
    width: 152,
    borderRadius: 16,
    padding: 14,
    marginRight: 10,
  },
  variantCardSelected: {
    borderWidth: 1.5,
    borderColor: "#2563EB",
    backgroundColor: "#EEF4FF",
  },
  variantCardUnselected: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 10,
  },
  actionButtonContainer: {
    alignItems: "flex-end",
  },
  addToCartButton: {
    width: 156,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#162456",
    justifyContent: "center",
    alignItems: "center",
  },
  stepperButton: {
    width: 156,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#162456",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  outOfStockButton: {
    width: 156,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F4F4F5",
    borderColor: "#E4E4E7",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
