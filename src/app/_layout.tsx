import "../../global.css";

import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 280,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              animation: "fade",
              animationDuration: 250,
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              animation: "fade",
              animationDuration: 250,
            }}
          />
          <Stack.Screen
            name="cataloguescreen"
            options={{
              headerShown: false,
              animation: "slide_from_right",
              animationDuration: 280,
            }}
          />
          <Stack.Screen
            name="requestscreen"
            options={{
              headerShown: false,
              animation: "slide_from_right",
              animationDuration: 280,
            }}
          />
          <Stack.Screen
            name="productdetails"
            options={{
              headerShown: false,
              animation: "slide_from_right",
              animationDuration: 280,
            }}
          />
          <Stack.Screen
            name="supplierdetails"
            options={{
              headerShown: false,
              animation: "slide_from_right",
              animationDuration: 280,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
