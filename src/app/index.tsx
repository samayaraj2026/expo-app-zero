import { AppNameLogo } from "@/assets";
import SignInBottomSheet from "@/components/SignInBottomSheet";
import AppButton from "@/components/ui/AppButton";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openSignIn = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 items-center justify-center">
        <AppNameLogo width={180} height={40} />
      </View>

      <View className="px-6 pb-6 w-full">
        <AppButton
          variant="solid"
          size="lg"
          label="Sign in"
          fullWidth
          onPress={openSignIn}
        />

        <Text className="text-center text-xs font-dm-regular text-black/70 mt-4 leading-5">
          By proceeding to use ZeroQue, you agree to our{" "}
          <Text className="underline decoration-black/70 font-dm-regular text-black/70">terms of service</Text>
          {"\n"}and{" "}
          <Text className="underline decoration-black/70 font-dm-regular text-black/70">privacy policy</Text>
        </Text>
      </View>

      <SignInBottomSheet sheetRef={bottomSheetRef} />
    </View>
  );
}
