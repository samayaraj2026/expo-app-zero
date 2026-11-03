import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ProfileIcon } from "@/assets";
import { EmptyStateBackdropBlob, SetupEmptyState } from "@/components/ui";
import { colors } from "@/themes/colors";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
});

export default function ProfileScreen() {
  const handleSignInAgain = useCallback(() => {
    router.replace("/");
  }, []);

  const emptyStateAction = useMemo(
    () => ({
      label: "Sign in again",
      onClick: handleSignInAgain,
    }),
    [handleSignInAgain],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
       <Text>Profile Screen</Text>
      </View>
    </SafeAreaView>
  );
}
