import React, { useCallback } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { VerifiedIcon } from "@/assets";
import { AppButton } from "@/components/ui";
import { useAppDispatch, useAppSelector, selectUserProfile, logout } from "@/store";
import { colors } from "@/themes/colors";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  spendingProgressBg: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: "hidden",
    marginVertical: 8,
  },
  spendingProgressBar: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectUserProfile);

  const handleSignOut = useCallback(() => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of ZeroQue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            dispatch(logout());
            router.replace("/");
          },
        },
      ],
    );
  }, [dispatch]);

  const spentAmount = 295.48;
  const spendingPercentage = Math.min(
    100,
    Math.round((spentAmount / profile.spendingLimit) * 100),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View className="px-5 py-3 border-b border-border bg-white">
        <Text className="font-dm-semibold text-lg text-black">
          Requester Profile & Governance
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.card}>
          <View className="flex-row items-center">
            <View style={styles.avatarCircle}>
              <Text className="font-dm-bold text-xl text-white">
                {profile.avatarInitials}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="font-dm-bold text-lg text-black">
                  {profile.name}
                </Text>
                <VerifiedIcon width={16} height={16} />
              </View>
              <Text className="font-dm-regular text-xs text-black70 mt-0.5">
                {profile.email}
              </Text>
              <Text className="font-dm-medium text-xs text-blue mt-1">
                {profile.organization} · {profile.role}
              </Text>
            </View>
          </View>
        </View>

        {/* Procurement Scope */}
        <View style={styles.card}>
          <Text className="font-dm-semibold text-sm text-black mb-3">
            Procurement Scope & Allocation
          </Text>

          <View style={styles.settingRow}>
            <Text className="font-dm-regular text-xs text-black70">Cost Centre</Text>
            <Text className="font-dm-medium text-xs text-black">{profile.costCentre}</Text>
          </View>

          <View style={styles.settingRow}>
            <Text className="font-dm-regular text-xs text-black70">Approval Tier</Text>
            <Text className="font-dm-medium text-xs text-black">Level 1 (Standard Requester)</Text>
          </View>

          <View className="pt-3">
            <View className="flex-row justify-between items-center">
              <Text className="font-dm-regular text-xs text-black70">
                Monthly Spending Limit
              </Text>
              <Text className="font-dm-semibold text-xs text-black">
                {profile.currency}{spentAmount.toFixed(2)} / {profile.currency}{profile.spendingLimit.toFixed(2)}
              </Text>
            </View>

            <View style={styles.spendingProgressBg}>
              <View
                style={[
                  styles.spendingProgressBar,
                  { width: `${spendingPercentage}%` },
                ]}
              />
            </View>

            <Text className="font-dm-regular text-[10px] text-black70 text-right">
              {spendingPercentage}% utilized · Resets in 18 days
            </Text>
          </View>
        </View>

        {/* Enterprise Governance */}
        <View style={styles.card}>
          <Text className="font-dm-semibold text-sm text-black mb-3">
            Enterprise Governance & Logistics
          </Text>

          <View style={styles.settingRow}>
            <Text className="font-dm-regular text-xs text-black70">Primary Delivery Hub</Text>
            <Text className="font-dm-medium text-xs text-black">London Central Hub (Dock 4)</Text>
          </View>

          <View style={styles.settingRow}>
            <Text className="font-dm-regular text-xs text-black70">SSO Directory</Text>
            <Text className="font-dm-medium text-xs text-green">Microsoft Entra ID (Active)</Text>
          </View>

          <View style={styles.settingRow}>
            <Text className="font-dm-regular text-xs text-black70">MFA Governance</Text>
            <Text className="font-dm-medium text-xs text-green">Enforced (FIDO2 / TOTP)</Text>
          </View>

          <View className="pt-3 flex-row justify-between items-center">
            <Text className="font-dm-regular text-xs text-black70">Application Version</Text>
            <Text className="font-dm-regular text-xs text-black70">ZeroQue Enterprise v1.0.0 (Release 1)</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <AppButton
          variant="secondary"
          size="lg"
          label="Sign Out"
          fullWidth
          onPress={handleSignOut}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
