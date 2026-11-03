import React, { memo } from "react";
import { View } from "react-native";
import { BackButton, SearchCartPill } from "@/components/ui";

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
  return (
    <View className="flex-row items-center justify-between px-5 pt-2 pb-2.5 z-20">
      <BackButton />

      {/* Right Search & Cart Pill */}
      <SearchCartPill
        cartCount={cartCount}
        onSearchPress={onSearchPress}
        onCartPress={onCartPress}
      />
    </View>
  );
});

export default SupplierNavBar;
