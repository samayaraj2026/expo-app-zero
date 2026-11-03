import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
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

export default function CatalogueScreen() {
  const handleExplore = useCallback(() => {
    router.push("/");
  }, []);

  const emptyStateAction = useMemo(
    () => ({
      label: "Back to Home",
      onClick: handleExplore,
    }),
    [handleExplore],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <SetupEmptyState
          illustration={
            <EmptyStateBackdropBlob>
              <CatalogueIcon width={56} height={56} stroke={colors.primary} />
            </EmptyStateBackdropBlob>
          }
          title="Catalogue Setup Pending"
          description="Enterprise product catalogue and multi-category lists will be connected in Stage 2."
          action={emptyStateAction}
        />
      </View>
    </SafeAreaView>
  );
}
