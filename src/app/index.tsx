import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-500 px-6">
      <Text className="text-white text-3xl font-dm-bold mb-2">
        DM Sans Bold
      </Text>
      <Text className="text-slate-300 text-xl font-dm-semibold mb-2">
        DM Sans SemiBold
      </Text>
      <Text className="text-slate-400 text-base font-dm-medium mb-2">
        DM Sans Medium
      </Text>
      <Text className="text-slate-500 text-sm font-dm-regular">
        DM Sans Regular (configured with NativeWind)
      </Text>
    </View>
  );
}

