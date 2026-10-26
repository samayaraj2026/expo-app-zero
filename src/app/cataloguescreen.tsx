import AppButton from "@/components/ui/AppButton";
import { CARD_CLASS, CATALOGUE_COLUMNS } from "@/constants";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CatalogueColumn({
  marginTop,
  count,
}: {
  marginTop: number;
  count: number;
}) {
  return (
    <View className="items-center gap-3" style={{ marginTop }}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} className={CARD_CLASS} />
      ))}
    </View>
  );
}

export default function CatalogueIntroScreen() {
  const insets = useSafeAreaInsets();

  const handleSkip = () => {
    router.replace("/(tabs)/home");
  };

  const handleNext = () => {
    router.push("/requestscreen");
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom, 16),
      }}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row justify-end px-6 pt-2">
        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.7}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
        >
          <Text className="font-dm-medium text-base text-black">Skip</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-14 items-center px-6">
        <Text className="mb-2 text-center font-dm-bold text-4xl text-black">
          {"Everything you can\nbuy, in one catalogue"}
        </Text>

        <Text className="text-center font-dm-regular text-base text-black/70">
          {
            "Browse approved products, add what you need, and\nsubmit, no spreadsheets, no guesswork."
          }
        </Text>
      </View>

      <View className="flex-1 flex-row justify-center items-start gap-3 overflow-hidden pt-6">
        {CATALOGUE_COLUMNS.map((column) => (
          <CatalogueColumn
            key={column.id}
            marginTop={column.marginTop}
            count={column.count}
          />
        ))}
      </View>

      <View className="w-full px-6 pb-3">
        <AppButton
          variant="solid"
          size="lg"
          label="Next"
          fullWidth
          onPress={handleNext}
        />
      </View>
    </View>
  );
}
