import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AppButton from "@/components/ui/AppButton";

export default function CatalogueIntroScreen() {
  const insets = useSafeAreaInsets();

  const handleSkip = () => {
    router.replace("/");
  };

  const handleNext = () => {
    router.replace("/");
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      <StatusBar style="dark" />

      {/* Top Header / Skip Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Title & Subtitle */}
      <View style={styles.headerContent}>
        <Text style={styles.title}>
          Everything you can{"\n"}buy, in one catalogue
        </Text>
        <Text style={styles.subtitle}>
          Browse approved products, add what you need, and submit, no spreadsheets, no guesswork.
        </Text>
      </View>

      {/* Center Illustration - Masonry Rounded Cards */}
      <View style={styles.masonryContainer}>
        {/* Column 1 */}
        <View style={[styles.column, { marginTop: 44 }]}>
          <View style={[styles.card, { height: 92 }]} />
          <View style={[styles.card, { height: 92 }]} />
        </View>

        {/* Column 2 */}
        <View style={[styles.column, { marginTop: 22 }]}>
          <View style={[styles.card, { height: 92 }]} />
          <View style={[styles.card, { height: 92 }]} />
        </View>

        {/* Column 3 (Center) */}
        <View style={[styles.column, { marginTop: 0 }]}>
          <View style={[styles.card, { height: 92 }]} />
          <View style={[styles.card, { height: 92 }]} />
          <View style={[styles.card, { height: 92 }]} />
        </View>

        {/* Column 4 */}
        <View style={[styles.column, { marginTop: 22 }]}>
          <View style={[styles.card, { height: 92 }]} />
          <View style={[styles.card, { height: 92 }]} />
        </View>

        {/* Column 5 */}
        <View style={[styles.column, { marginTop: 44 }]}>
          <View style={[styles.card, { height: 92 }]} />
          <View style={[styles.card, { height: 92 }]} />
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  skipText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: "#18181B",
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 28,
    marginTop: 8,
  },
  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 27,
    lineHeight: 35,
    color: "#0a0a0a",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 19,
    color: "#71717A",
    textAlign: "center",
  },
  masonryContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    overflow: "hidden",
    paddingHorizontal: 6,
    marginVertical: 16,
  },
  column: {
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
  },
  card: {
    width: 68,
    borderRadius: 14,
    backgroundColor: "#D4D4D8",
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    width: "100%",
  },
});
