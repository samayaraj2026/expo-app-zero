import React, { memo } from "react";
import { Text, View } from "react-native";
import { VerifiedIcon } from "@/assets";

export interface SupplierHeaderProps {
  name: string;
  location: string;
  verified?: boolean;
}

export const SupplierHeader = memo(function SupplierHeader({
  name,
  location,
  verified = false,
}: SupplierHeaderProps) {
  return (
    <View>
      {/* Title & Verified Badge */}
      <View className="flex-row items-center flex-wrap gap-1">
        <Text className="font-dm-semibold text-xl text-black">{name}</Text>
        {verified && (
          <View className="flex-row items-center bg-secondary px-3 py-1 rounded-full gap-1.5">
            <VerifiedIcon width={16} height={16} />
            <Text className="font-dm-medium text-sm text-blue">Verified</Text>
          </View>
        )}
      </View>

      {/* Location */}
      <Text className="font-dm-regular text-xs text-black70 mt-1">
        {location}
      </Text>
    </View>
  );
});

export default SupplierHeader;
