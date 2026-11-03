import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { HomeIcon } from "@/assets";
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

export default function HomeScreen() {
  const handleBrowseCatalogue = useCallback(() => {
    router.push("/(tabs)/catalogue");
  }, []);

  const emptyStateAction = useMemo(
    () => ({
      label: "+ Browse Catalogue",
      onClick: handleBrowseCatalogue,
    }),
    [handleBrowseCatalogue],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
      
<Text>HomeScreen</Text>

      </View>
    </SafeAreaView>
  );
}
