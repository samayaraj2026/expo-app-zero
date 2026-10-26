import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Polyline,
  Rect,
  Stop,
} from "react-native-svg";
import { BackButton } from "@/components/ui";
import { CartIcon, MinusIcon, PlusIcon, SearchIcon } from "@/assets";
import { colors } from "@/themes/colors";
import {
  DEFAULT_SUPPLIER,
  getSupplierDetails,
  type SupplierDetailsData,
} from "@/constants/supplier";
import type { Product } from "@/types/catalogue";

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

function VerifiedIcon({ size = 15 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Circle cx="8" cy="8" r="8" fill="#2563EB" />
      <Path
        d="M5 8.2L7 10.2L11 5.8"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CopyIcon({ size = 14, color = "#6B7280" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Svg>
  );
}

function ExternalLinkIcon({ size = 14, color = "#6B7280" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <Polyline points="15 3 21 3 21 9" />
      <Line x1="10" y1="14" x2="21" y2="3" />
    </Svg>
  );
}

function FullStarIcon({ size = 13 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="#F59E0B">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </Svg>
  );
}

function HalfStarIcon({ size = 13 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id="halfStarGrad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="50%" stopColor="#F59E0B" />
          <Stop offset="50%" stopColor="#E5E7EB" />
        </LinearGradient>
      </Defs>
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="url(#halfStarGrad)"
      />
    </Svg>
  );
}

// ─── Memoized Product Row Item ────────────────────────────────────────────────
interface SupplierProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const SupplierProductCard = memo(function SupplierProductCard({
  product,
  onPress,
  onAddToCart,
}: SupplierProductCardProps) {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = useCallback(() => {
    const next = quantity + 1;
    setQuantity(next);
    onAddToCart(product, next);
  }, [quantity, product, onAddToCart]);

  const handleIncrement = useCallback(() => {
    const next = quantity + 1;
    setQuantity(next);
    onAddToCart(product, next);
  }, [quantity, product, onAddToCart]);

  const handleDecrement = useCallback(() => {
    const next = Math.max(0, quantity - 1);
    setQuantity(next);
    onAddToCart(product, next);
  }, [quantity, product, onAddToCart]);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(product)}
      style={styles.productCardContainer}
    >
      {/* Left Info Column */}
      <View style={styles.productLeftInfo}>
        <Text
          numberOfLines={2}
          style={styles.productTitle}
        >
          {product.name}
        </Text>

        {product.packageInfo ? (
          <View style={styles.packageBadge}>
            <Text style={styles.packageBadgeText}>{product.packageInfo}</Text>
          </View>
        ) : null}

        {product.supplier ? (
          <Text numberOfLines={1} style={styles.supplierText}>
            {product.supplier}
          </Text>
        ) : null}

        <Text style={styles.productPrice}>
          {product.currency}
          {product.price.toFixed(2)}
        </Text>
      </View>

      {/* Right Column: Image + ADD Button */}
      <View style={styles.productRightColumn}>
        <View style={styles.productImageContainer}>
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>

        {/* ADD or Stepper Button */}
        {quantity === 0 ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAdd}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDecrement}
              style={styles.stepperAction}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MinusIcon width={12} height={12} stroke="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.stepperText}>{quantity}</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleIncrement}
              style={styles.stepperAction}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <PlusIcon width={12} height={12} stroke="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

// ─── Main Supplier Details Screen ─────────────────────────────────────────────

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

  const handleOpenEmail = useCallback((email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      handleCopy(email, "Email");
    });
  }, [handleCopy]);

  const handleOpenPhone = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`).catch(() => {
      handleCopy(phone, "Phone");
    });
  }, [handleCopy]);

  // Render header items above the virtualized product list
  const renderListHeader = useCallback(() => {
    return (
      <View style={styles.headerContentContainer}>
        {/* Supplier Header Info */}
        <View style={styles.supplierTitleRow}>
          <Text style={styles.supplierTitle}>{supplierData.name}</Text>
          {supplierData.verified && (
            <View style={styles.verifiedBadge}>
              <VerifiedIcon size={13} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>

        <Text style={styles.supplierLocation}>{supplierData.location}</Text>

        {/* ── Stat Cards ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Products</Text>
            <Text style={styles.statValue}>{supplierData.productCount}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>On-time delivery</Text>
            <Text style={styles.statValue}>{supplierData.onTimeDeliveryRate}%</Text>
          </View>
        </View>

        {/* ── About Section ── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>About</Text>

          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Categories</Text>
            <Text style={styles.aboutValue}>{supplierData.categories}</Text>
          </View>

          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Email</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleOpenEmail(supplierData.email)}
              style={styles.aboutActionRow}
            >
              <Text style={styles.aboutValueLink}>{supplierData.email}</Text>
              <CopyIcon size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Phone</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleOpenPhone(supplierData.phone)}
              style={styles.aboutActionRow}
            >
              <Text style={styles.aboutValueLink}>{supplierData.phone}</Text>
              <CopyIcon size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Website</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleOpenUrl(supplierData.website)}
              style={styles.aboutActionRow}
            >
              <Text style={styles.aboutValueLink}>{supplierData.website}</Text>
              <ExternalLinkIcon size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* ── Reviews Section ── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>Reviews</Text>

          <View style={styles.reviewsCard}>
            {/* Review Summary Header */}
            <View style={styles.reviewSummaryRow}>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreText}>{supplierData.rating.toFixed(1)}</Text>
                <View style={styles.starsContainer}>
                  <FullStarIcon />
                  <FullStarIcon />
                  <FullStarIcon />
                  <FullStarIcon />
                  <HalfStarIcon />
                </View>
              </View>

              <Text style={styles.ratingsCountText}>{supplierData.ratingCount}</Text>
            </View>

            {/* Rating Breakdown Bars */}
            <View style={styles.breakdownContainer}>
              {supplierData.ratingBreakdown.map((item) => (
                <View key={item.stars} style={styles.barRow}>
                  <Text style={styles.barStarLabel}>{item.stars}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${Math.min(100, Math.max(0, item.percentage))}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.barPercentage}>{item.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.thickSectionDivider} />

        {/* ── Products Section Header & Filters ── */}
        <View style={styles.productsHeaderSection}>
          <View style={styles.productsHeadingRow}>
            <Text style={styles.productsTitle}>Products</Text>
            <View style={styles.productCountBadge}>
              <Text style={styles.productCountBadgeText}>{supplierData.productsCount}</Text>
            </View>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <SearchIcon width={16} height={16} stroke="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${supplierData.name}`}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>

          {/* Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryFiltersContainer}
          >
            {supplierData.categoryFilters.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  activeOpacity={0.7}
                  onPress={() =>
                    setSelectedCategory(isSelected ? null : category)
                  }
                  style={[
                    styles.categoryPill,
                    isSelected && styles.categoryPillSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.categoryDot,
                      isSelected && styles.categoryDotSelected,
                    ]}
                  />
                  <Text
                    style={[
                      styles.categoryPillText,
                      isSelected && styles.categoryPillTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
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
      <SupplierProductCard
        product={item}
        onPress={handleProductPress}
        onAddToCart={handleAddToCart}
      />
    ),
    [handleProductPress, handleAddToCart]
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* ── Top Header Navigation Bar ── */}
      <View style={styles.topNavBar}>
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
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Virtualized Product List with Embedded Header ── */}
      <FlatList
        data={filteredProducts}
        keyExtractor={keyExtractor}
        renderItem={renderProductItem}
        ListHeaderComponent={renderListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No products found matching &quot;{searchQuery}&quot;
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

export default memo(SupplierDetailsScreen);

// ─── Stylesheet ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topNavBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
    zIndex: 20,
  },
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
  listContentContainer: {
    paddingBottom: 60,
  },
  headerContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  supplierTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  supplierTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    color: "#111827",
    letterSpacing: -0.3,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#2563EB",
  },
  supplierLocation: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F4F5F7",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
  },
  statValue: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    color: "#111827",
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeading: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: "#111827",
    marginBottom: 12,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
  },
  aboutLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#111827",
  },
  aboutValue: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#4B5563",
  },
  aboutActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  aboutValueLink: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#4B5563",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 18,
  },
  reviewsCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  reviewSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scoreText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: "#111827",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingsCountText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#6B7280",
  },
  breakdownContainer: {
    gap: 8,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  barStarLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: "#4B5563",
    width: 12,
    textAlign: "center",
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#162456",
    borderRadius: 3,
  },
  barPercentage: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#6B7280",
    width: 32,
    textAlign: "right",
  },
  thickSectionDivider: {
    height: 8,
    backgroundColor: "#F9FAFB",
    marginHorizontal: -20,
    marginTop: 26,
    marginBottom: 20,
  },
  productsHeaderSection: {
    marginBottom: 16,
  },
  productsHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  productsTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 18,
    color: "#111827",
  },
  productCountBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  productCountBadgeText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: "#4B5563",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F5F7",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#111827",
    paddingVertical: 0,
  },
  categoryFiltersContainer: {
    flexDirection: "row",
    gap: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  categoryPillSelected: {
    backgroundColor: "#162456",
    borderColor: "#162456",
  },
  categoryDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#E5E7EB",
  },
  categoryDotSelected: {
    backgroundColor: "#93C5FD",
  },
  categoryPillText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "#374151",
  },
  categoryPillTextSelected: {
    color: "#FFFFFF",
    fontFamily: "DMSans_600SemiBold",
  },
  productCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  productLeftInfo: {
    flex: 1,
    paddingRight: 16,
  },
  productTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#111827",
    lineHeight: 20,
  },
  packageBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  packageBadgeText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#4B5563",
  },
  supplierText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  productPrice: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: "#111827",
    marginTop: 6,
  },
  productRightColumn: {
    alignItems: "center",
    width: 106,
  },
  productImageContainer: {
    width: 106,
    height: 92,
    backgroundColor: "#F4F5F7",
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F4F5F7",
  },
  addButton: {
    width: 106,
    height: 36,
    backgroundColor: "#162456",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 106,
    height: 36,
    backgroundColor: "#162456",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  stepperAction: {
    padding: 4,
  },
  stepperText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
