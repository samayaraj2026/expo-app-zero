import React, { memo } from "react";
import { Text, View } from "react-native";
import { StarIcon } from "@/assets";
import type { SupplierRatingBreakdown } from "@/constants/supplier";

export interface SupplierReviewsCardProps {
  rating: number;
  ratingCount: string;
  ratingBreakdown: SupplierRatingBreakdown[];
}

export const SupplierReviewsCard = memo(function SupplierReviewsCard({
  rating,
  ratingCount,
  ratingBreakdown,
}: SupplierReviewsCardProps) {
  const roundedRating = Math.round(rating);

  return (
    <View className="mt-6">
      <Text className="font-dm-semibold text-[18px] text-black mb-4">Reviews</Text>

      <View className="border border-border/60 rounded-2xl p-4 bg-white">
        {/* Review Summary Header */}
        <View className="flex-row items-center justify-between mb-5 border-b border-border/60 pb-5">
          <View className="flex-row items-center gap-2">
            <Text className="font-dm-bold text-base text-black ">
              {rating.toFixed(1)}
            </Text>
            <View className="flex-row items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((starIdx) => (
                <View
                  key={starIdx}
                  className={starIdx <= roundedRating ? "opacity-100" : "opacity-30"}
                >
                  <StarIcon width={14} height={14} />
                </View>
              ))}
            </View>
          </View>

          <Text className="font-dm-regular text-sm text-black70">
            {ratingCount}
          </Text>
        </View>

        {/* Rating Breakdown Bars */}
        <View className="gap-3.5">
          {ratingBreakdown.map((item) => (
            <View key={item.stars} className="flex-row items-center gap-2.5">
              <Text className="font-dm-medium text-sm text-black70 w-3 text-center">
                {item.stars}
              </Text>
              <View className="flex-1 h-1.5 bg-gray/20 rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full border"
                  style={{
                    width: `${Math.min(100, Math.max(0, item.percentage))}%`,
                  }}
                />
              </View>
              <Text className="font-dm-regular text-sm text-black70 w-8 text-right">
                {item.percentage}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

export default SupplierReviewsCard;
