import React, { memo } from "react";
import { Text, View } from "react-native";

export interface StatCardProps {
  label: string;
  value: string | number;
}

export const StatCard = memo(function StatCard({ label, value }: StatCardProps) {
  return (
    <View className="flex-1 bg-surface rounded-2xl p-4">
      <Text className="font-dm-regular text-sm text-black70 mb-1">{label}</Text>
      <Text className="font-dm-bold text-xl text-black">{value}</Text>
    </View>
  );
});

export interface SupplierStatsProps {
  productCount: number;
  onTimeDeliveryRate: number;
}

export const SupplierStats = memo(function SupplierStats({
  productCount,
  onTimeDeliveryRate,
}: SupplierStatsProps) {
  return (
    <View className="flex-row gap-3 mt-4">
      <StatCard label="Products" value={productCount} />
      <StatCard label="On-time delivery" value={`${onTimeDeliveryRate}%`} />
    </View>
  );
});

export default SupplierStats;
