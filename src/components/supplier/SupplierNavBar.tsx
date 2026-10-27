import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { BackButton } from "@/components/ui";
import { CartIcon, SearchIcon } from "@/assets";
import { colors } from "@/themes/colors";

export interface SupplierNavBarProps {
  cartCount?: number;
  onSearchPress?: () => void;
  onCartPress?: () => void;
}

export const SupplierNavBar = memo(function SupplierNavBar({
  cartCount = 0,
  onSearchPress,
  onCartPress,
}: SupplierNavBarProps) {
  const handleSearch = onSearchPress ?? (() => router.push("/(tabs)/catalogue"));
  const handleCart = onCartPress ?? (() => router.push("/(tabs)/cart"));

  return (
    <View className="flex-row items-center justify-between px-5 pt-2 pb-2.5 z-20">
      <BackButton />

      {/* Right Search & Cart Pill */}
      <View
        className="flex-row items-center h-11 px-4 rounded-full bg-white gap-3.5"
        style={{
          shadowColor: colors.shadowDrop,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSearch}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <SearchIcon width={18} height={18} stroke={colors.black} />
        </TouchableOpacity>

        <View className="w-[1px] h-4 bg-gray-200" />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCart}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="relative"
        >
          <CartIcon width={20} height={20} stroke={colors.black} />
          {cartCount > 0 && (
            <View className="absolute -top-1.5 -right-2 bg-red w-4 h-4 rounded-full items-center justify-center">
              <Text className="text-white text-[10px] font-dm-bold leading-3">
                {cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default SupplierNavBar;
