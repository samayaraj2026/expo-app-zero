import React, { memo, useCallback, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { CartIcon, MinusIcon, PlusIcon } from "@/assets";
import { AppButton, EmptyStateBackdropBlob, SetupEmptyState } from "@/components/ui";
import {
  useAppDispatch,
  useAppSelector,
  selectCartItems,
  selectCartTotalCount,
  selectCartSubtotal,
  selectCartVat,
  selectCartTotal,
  incrementItem,
  decrementItem,
  removeItem,
  clearCart,
  createRequisition,
} from "@/store";
import { haptics } from "@/utils/haptics";
import { colors } from "@/themes/colors";
import type { CartItem } from "@/store/slices/cartSlice";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  itemCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemImage: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 32,
    gap: 8,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
});

interface CartItemRowProps {
  item: CartItem;
  onIncrement: (item: CartItem) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
}

const CartItemRow = memo(function CartItemRow({
  item,
  onIncrement,
  onDecrement,
}: CartItemRowProps) {
  const { product, quantity } = item;

  return (
    <View style={styles.itemCard}>
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.itemImage}
          contentFit="cover"
        />
      ) : (
        <View style={styles.itemImage} />
      )}

      <View style={styles.itemDetails}>
        <Text
          numberOfLines={1}
          className="font-dm-medium text-sm text-black"
        >
          {product.name}
        </Text>
        <Text className="font-dm-regular text-xs text-black70 mt-0.5">
          {product.packageInfo || product.category || "—"}
        </Text>
        <Text className="font-dm-semibold text-sm text-black mt-1">
          {product.currency}
          {(product.price * quantity).toFixed(2)}
        </Text>
      </View>

      <View style={styles.stepperContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onDecrement(product.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MinusIcon width={12} height={12} stroke={colors.white} />
        </TouchableOpacity>

        <Text className="font-dm-bold text-xs text-white">
          {quantity}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onIncrement(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <PlusIcon width={12} height={12} stroke={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function CartScreen() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const totalCount = useAppSelector(selectCartTotalCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const vat = useAppSelector(selectCartVat);
  const total = useAppSelector(selectCartTotal);

  const handleBrowseCatalogue = useCallback(() => {
    router.push("/(tabs)/catalogue");
  }, []);

  const handleIncrement = useCallback(
    (item: CartItem) => {
      haptics.light();
      dispatch(incrementItem(item.product));
    },
    [dispatch],
  );

  const handleDecrement = useCallback(
    (productId: string) => {
      haptics.light();
      dispatch(decrementItem(productId));
    },
    [dispatch],
  );

  const handleRemove = useCallback(
    (productId: string) => {
      haptics.medium();
      dispatch(removeItem(productId));
    },
    [dispatch],
  );

  const handleClearCart = useCallback(() => {
    haptics.medium();
    dispatch(clearCart());
  }, [dispatch]);

  const handleSubmitRequisition = useCallback(() => {
    if (cartItems.length === 0) return;
    haptics.success();
    dispatch(
      createRequisition({
        items: cartItems,
        department: "Operations",
      }),
    );
    dispatch(clearCart());
    router.push("/(tabs)/home");
  }, [cartItems, dispatch]);

  const emptyStateAction = useMemo(
    () => ({
      label: "+ Browse Catalogue",
      onClick: handleBrowseCatalogue,
    }),
    [handleBrowseCatalogue],
  );

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <CartItemRow
        item={item}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
      />
    ),
    [handleIncrement, handleDecrement, handleRemove],
  );

  const keyExtractor = useCallback((item: CartItem) => item.product.id, []);

  if (totalCount === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.emptyContainer}>
          <SetupEmptyState
            illustration={
              <EmptyStateBackdropBlob>
                <CartIcon width={56} height={56} stroke={colors.primary} />
              </EmptyStateBackdropBlob>
            }
            title="Your Basket is Empty"
            description="Explore our enterprise catalogue to add products, request supplies, and submit for approval."
            action={emptyStateAction}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-border bg-white">
        <Text className="font-dm-semibold text-lg text-black">
          Requisition Basket ({totalCount})
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={handleClearCart}>
          <Text className="font-dm-regular text-xs text-red">Clear all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View>
            <View style={styles.summaryCard}>
              <View className="flex-row justify-between mb-2">
                <Text className="font-dm-regular text-sm text-black70">Subtotal</Text>
                <Text className="font-dm-medium text-sm text-black">£{subtotal.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="font-dm-regular text-sm text-black70">Estimated VAT (20%)</Text>
                <Text className="font-dm-medium text-sm text-black">£{vat.toFixed(2)}</Text>
              </View>
              <View className="border-t border-border pt-2 mt-1 flex-row justify-between items-center">
                <Text className="font-dm-semibold text-base text-black">Total</Text>
                <Text className="font-dm-bold text-lg text-primary">£{total.toFixed(2)}</Text>
              </View>
            </View>

            <AppButton
              variant="solid"
              size="lg"
              label="Submit Requisition"
              fullWidth
              onPress={handleSubmitRequisition}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}
