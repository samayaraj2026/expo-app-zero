import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView
      className="flex-1 bg-slate-50"
      edges={["top", "left", "right"]}
    >
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-dm-bold text-[22px] text-slate-900 mb-2">
          Home Screen
        </Text>
        <Text className="font-dm-regular text-[15px] text-slate-500">
          This is the Home Screen
        </Text>
      </View>
    </SafeAreaView>
  );
}
