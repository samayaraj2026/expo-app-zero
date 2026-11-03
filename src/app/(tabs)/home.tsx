import React, { memo, useCallback, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { HomeIcon, NotifyIcon } from "@/assets";
import { EmptyStateBackdropBlob, SetupEmptyState } from "@/components/ui";
import {
  useAppSelector,
  selectRequisitions,
  selectUserProfile,
} from "@/store";
import { colors } from "@/themes/colors";
import type { Requisition } from "@/store/slices/requisitionSlice";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressBarContainer: {
    flexDirection: "row",
    gap: 6,
    marginVertical: 12,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  progressActive: {
    backgroundColor: colors.green,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
});

interface RequisitionCardProps {
  requisition: Requisition;
}

const RequisitionCard = memo(function RequisitionCard({
  requisition,
}: RequisitionCardProps) {
  const getBadgeStyle = () => {
    switch (requisition.status) {
      case "delivered":
        return { backgroundColor: colors.emeraldBg, textColor: colors.emerald };
      case "approved":
        return { backgroundColor: colors.secondary, textColor: colors.blue };
      case "awaiting_approval":
      default:
        return { backgroundColor: colors.amberBg, textColor: colors.amberDark };
    }
  };

  const badge = getBadgeStyle();

  return (
    <View style={styles.card}>
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="font-dm-bold text-xs text-black70">
          {requisition.orderNumber}
        </Text>
        <Text className="font-dm-regular text-xs text-black70">
          {requisition.submittedAt}
        </Text>
      </View>

      <Text className="font-dm-semibold text-base text-black mb-1">
        {requisition.title}
      </Text>

      {/* 4-Stage Visual Progress Bars */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressSegment,
            requisition.progressStage >= 1 && styles.progressActive,
          ]}
        />
        <View
          style={[
            styles.progressSegment,
            requisition.progressStage >= 2 && styles.progressActive,
          ]}
        />
        <View
          style={[
            styles.progressSegment,
            requisition.progressStage >= 3 && styles.progressActive,
          ]}
        />
        <View
          style={[
            styles.progressSegment,
            requisition.progressStage >= 4 && styles.progressActive,
          ]}
        />
      </View>

      <View className="flex-row items-center justify-between mt-1">
        <View
          style={[styles.statusBadge, { backgroundColor: badge.backgroundColor }]}
        >
          <Text
            className="font-dm-medium text-xs"
            style={{ color: badge.textColor }}
          >
            {requisition.statusLabel}
          </Text>
        </View>

        <Text className="font-dm-bold text-base text-black">
          {requisition.currency}
          {requisition.totalAmount.toFixed(2)}
        </Text>
      </View>

      {requisition.waitingOn ? (
        <Text className="font-dm-regular text-xs text-black70 mt-3 pt-2 border-t border-border">
          Status: {requisition.waitingOn}
        </Text>
      ) : null}
    </View>
  );
});

export default function HomeScreen() {
  const requisitions = useAppSelector(selectRequisitions);
  const user = useAppSelector(selectUserProfile);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const pendingCount = useMemo(
    () => requisitions.filter((r) => r.status === "awaiting_approval").length,
    [requisitions],
  );

  const approvedCount = useMemo(
    () => requisitions.filter((r) => r.status === "approved").length,
    [requisitions],
  );

  const deliveredCount = useMemo(
    () => requisitions.filter((r) => r.status === "delivered").length,
    [requisitions],
  );

  const filteredRequisitions = useMemo(() => {
    if (filter === "pending") {
      return requisitions.filter((r) => r.status === "awaiting_approval");
    }
    if (filter === "approved") {
      return requisitions.filter((r) => r.status === "approved" || r.status === "delivered");
    }
    return requisitions;
  }, [requisitions, filter]);

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

  const renderItem = useCallback(
    ({ item }: { item: Requisition }) => <RequisitionCard requisition={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Requisition) => item.id, []);

  if (requisitions.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.emptyContainer}>
          <SetupEmptyState
            illustration={
              <EmptyStateBackdropBlob>
                <HomeIcon width={56} height={56} stroke={colors.primary} />
              </EmptyStateBackdropBlob>
            }
            title="No Active Requests"
            description="You haven't submitted any purchase requisitions yet. Browse our enterprise catalogue to place an order."
            action={emptyStateAction}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View>
          <Text className="font-dm-bold text-xl text-black">
            ZeroQue Procurement
          </Text>
          <Text className="font-dm-regular text-xs text-black70">
            {user.organization} · {user.role}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} className="p-1">
          <NotifyIcon width={22} height={22} stroke={colors.black} />
        </TouchableOpacity>
      </View>

      {/* Summary KPI Cards */}
      <View style={styles.kpiRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFilter("pending")}
          style={[
            styles.kpiCard,
            filter === "pending" && { borderColor: colors.primary, borderWidth: 1.5 },
          ]}
        >
          <Text className="font-dm-regular text-xs text-black70">Pending</Text>
          <Text className="font-dm-bold text-xl text-amberDark mt-1">
            {pendingCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFilter("approved")}
          style={[
            styles.kpiCard,
            filter === "approved" && { borderColor: colors.primary, borderWidth: 1.5 },
          ]}
        >
          <Text className="font-dm-regular text-xs text-black70">Approved</Text>
          <Text className="font-dm-bold text-xl text-blue mt-1">
            {approvedCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFilter("all")}
          style={[
            styles.kpiCard,
            filter === "all" && { borderColor: colors.primary, borderWidth: 1.5 },
          ]}
        >
          <Text className="font-dm-regular text-xs text-black70">Completed</Text>
          <Text className="font-dm-bold text-xl text-emerald mt-1">
            {deliveredCount}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRequisitions}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
