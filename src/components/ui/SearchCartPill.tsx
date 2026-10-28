import React, { memo } from "react";
import {
  Insets,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { router } from "expo-router";
import { CartIcon, SearchIcon } from "@/assets";
import { colors } from "@/themes/colors";

export interface SearchCartPillProps {
  onSearchPress?: () => void;
  onCartPress?: () => void;
  cartCount?: number;
  showCartBadge?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  activeOpacity?: number;
  hitSlop?: Insets | number;
  searchIconWidth?: number;
  searchIconHeight?: number;
  searchIconStroke?: string;
  cartIconWidth?: number;
  cartIconHeight?: number;
  cartIconStroke?: string;
  testID?: string;
  searchTestID?: string;
  cartTestID?: string;
}

const DEFAULT_HIT_SLOP: Insets = { top: 8, bottom: 8, left: 8, right: 8 };

const SearchCartPill = memo(function SearchCartPill({
  onSearchPress,
  onCartPress,
  cartCount = 1,
  showCartBadge = true,
  style,
  className,
  activeOpacity = 0.7,
  hitSlop = DEFAULT_HIT_SLOP,
  searchIconWidth = 18,
  searchIconHeight = 18,
  searchIconStroke = "#000000",
  cartIconWidth = 16,
  cartIconHeight = 18,
  cartIconStroke = "#000000",
  testID,
  searchTestID,
  cartTestID,
}: SearchCartPillProps) {
  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      router.push("/(tabs)/catalogue");
    }
  };

  const handleCartPress = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      router.push("/(tabs)/cart");
    }
  };

  const shouldShowBadge =
    showCartBadge && (cartCount === undefined || cartCount > 0);

  return (
    <View
      testID={testID}
      className={className}
      style={[styles.container, style]}
    >
      <TouchableOpacity
        testID={searchTestID}
        activeOpacity={activeOpacity}
        onPress={handleSearchPress}
        hitSlop={hitSlop}
      >
        <SearchIcon
          width={searchIconWidth}
          height={searchIconHeight}
          stroke={searchIconStroke}
        />
      </TouchableOpacity>

      <TouchableOpacity
        testID={cartTestID}
        activeOpacity={activeOpacity}
        onPress={handleCartPress}
        hitSlop={hitSlop}
        style={styles.cartButton}
      >
        <CartIcon
          width={cartIconWidth}
          height={cartIconHeight}
          stroke={cartIconStroke}
        />
        {shouldShowBadge && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
});

export default SearchCartPill;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 22,
    backgroundColor: colors.white,
    boxShadow: "0px 8px 32px 0px rgba(0, 0, 0, 0.12)",
    shadowColor: colors.semi_transparent_white,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    gap: 20,
  },
  cartButton: {
    position: "relative",
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
});
