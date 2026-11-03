import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CopyIcon } from "@/assets";
import { colors } from "@/themes/colors";

export interface SupplierAboutSectionProps {
  categories: string;
  email: string;
  phone: string;
  website: string;
  onOpenEmail: (email: string) => void;
  onOpenPhone: (phone: string) => void;
  onOpenWebsite: (url: string) => void;
}

export const SupplierAboutSection = memo(function SupplierAboutSection({
  categories,
  email,
  phone,
  website,
  onOpenEmail,
  onOpenPhone,
  onOpenWebsite,
}: SupplierAboutSectionProps) {
  return (
    <View className="mt-6">
      <Text className="font-dm-semibold text-[18px] text-black mb-4">About</Text>

      {/* Categories */}
      <View className="flex-row justify-between items-center py-2.5 ">
        <Text className="font-dm-semibold text-base text-black">Categories</Text>
        <Text className="font-dm-regular text-base text-black70">
          {categories}
        </Text>
      </View>

      {/* Email */}
      <View className="flex-row justify-between items-center py-2.5 ">
        <Text className="font-dm-semibold text-base text-black">Email</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onOpenEmail(email)}
          className="flex-row items-center gap-1.5"
        >
          <Text className="font-dm-regular text-base text-black70">{email}</Text>
          <CopyIcon width={16} height={16} stroke={colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Phone */}
      <View className="flex-row justify-between items-center py-2.5">
        <Text className="font-dm-semibold text-base text-black">Phone</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onOpenPhone(phone)}
          className="flex-row items-center gap-1.5"
        >
          <Text className="font-dm-regular text-base text-black70">{phone}</Text>
          <CopyIcon width={16} height={16} stroke={colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Website */}
      <View className="flex-row justify-between items-center py-2.5">
        <Text className="font-dm-semibold text-base text-black">Website</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onOpenWebsite(website)}
          className="flex-row items-center gap-1.5"
        >
          <Text className="font-dm-regular text-base text-black70">{website}</Text>
          <CopyIcon width={16} height={16} stroke={colors.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default SupplierAboutSection;
