import React, { useCallback, useRef } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";
import { AppNameLogo } from "@/assets";
import { SignInBottomSheet } from "@/features/auth";
import { AppButton } from "@/components/ui";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openSignIn = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-1 items-center justify-center">
        <AppNameLogo width={180} height={40} />
      </View>

      <View
        className="px-6 w-full"
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
      >
        <AppButton
          variant="solid"
          size="lg"
          label="Sign in"
          fullWidth
          onPress={openSignIn}
        />

        <Text className="text-center text-xs font-dm-regular text-black70 mt-4 leading-5">
          By proceeding to use ZeroQue, you agree to our{" "}
          <Text className="underline decoration-black70 font-dm-regular text-black70">
            terms of service
          </Text>
          {"\n"}and{" "}
          <Text className="underline decoration-black70 font-dm-regular text-black70">
            privacy policy
          </Text>
        </Text>
      </View>

      <SignInBottomSheet sheetRef={bottomSheetRef} />
    </View>
  );
}
