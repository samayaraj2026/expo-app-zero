import AppButton from "@/components/ui/AppButton";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RequestStatusScreen() {
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <View
      className="flex-1 bg-white justify-between"
      style={{
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom, 16),
      }}
    >
      <StatusBar style="dark" />

      <View className="items-center px-6 mt-20">
        <Text className="font-dm-bold text-4xl text-black text-center mb-2">
          Know exactly where every request stands
        </Text>
        <Text className="font-dm-regular text-base text-black/70 text-center">
          From submitted to delivered, see the full history and who it&apos;s waiting on.
        </Text>
      </View>

      <View className="flex-1 justify-center items-center px-6 my-3 relative">
        <View className="absolute w-[270px] h-[230px] rounded-[16px] border-[1.5px] border-[#E5E7EB] bg-white" />

        <View
          className="w-full max-w-[320px] bg-white rounded-[12px] py-5 px-5 border border-[#F4F4F5]"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 2,
          }}
        >
          <Text className="font-dm-bold text-base text-black mb-3.5">
            Ergonomic office chair, premium
          </Text>

          <View className="flex-row items-center gap-1.5 mb-3.5 w-full">
            <View className="flex-1 h-1 rounded-sm bg-green" />
            <View className="flex-1 h-1 rounded-sm bg-border" />
            <View className="flex-1 h-1 rounded-sm bg-border" />
          </View>

          <View className="self-start bg-[#FEF3C7] px-2.5 py-1 rounded-md">
            <Text className="font-dm-medium text-xs text-[#92400E]">
              Awaiting approval
            </Text>
          </View>
        </View>
      </View>

      <View className="px-6 pb-3 w-full">
        <AppButton
          variant="solid"
          size="lg"
          label="Continue"
          fullWidth
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}
