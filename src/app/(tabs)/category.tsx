import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { CatalogueIcon } from "@/assets";
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

export default function CategoryScreen() {
  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const emptyStateAction = useMemo(
    () => ({
      label: "Go Back",
      onClick: handleBack,
    }),
    [handleBack],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <Text>Catagory Screen</Text>
      </View>
    </SafeAreaView>
  );
}
