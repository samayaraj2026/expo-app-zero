import React, { memo } from "react";
import { CartIcon, CatalogueIcon, HomeIcon, ProfileIcon } from "@/assets";
import {
  TAB_ACTIVE_PILL_BG,
  TAB_BAR_BLUR_INTENSITY,
  TAB_BAR_BLUR_TINT,
  TAB_BAR_BORDER_COLOR,
  TAB_BAR_BORDER_RADIUS,
  TAB_BAR_BOX_SHADOW,
  TAB_BAR_HEIGHT,
  TAB_BAR_HORIZONTAL_OFFSET,
  TAB_BAR_SHADOW,
  TAB_ICON_SIZES,
  TAB_PILL_BORDER_RADIUS,
  TAB_PILL_HEIGHT,
  TAB_PILL_WIDTH,
} from "@/constants/tabBar";
import { useFloatingTabBar } from "@/hooks";
import { colors } from "@/themes/colors";
import type { CustomTabBarProps, TabRoute } from "@/types/tabBar";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Render tab bar icons matching reference design specifications.
 */
function renderTabIcon(routeName: string, cartCount: number) {
  switch (routeName) {
    case "home":
      return (
        <HomeIcon
          width={TAB_ICON_SIZES.home.width}
          height={TAB_ICON_SIZES.home.height}
        />
      );
    case "catalogue":
      return (
        <CatalogueIcon
          width={TAB_ICON_SIZES.catalogue.width}
          height={TAB_ICON_SIZES.catalogue.height}
        />
      );
    case "cart":
      return (
        <View className="relative w-6 h-6 items-center justify-center">
          <CartIcon
            width={TAB_ICON_SIZES.cart.width}
            height={TAB_ICON_SIZES.cart.height}
          />
          {cartCount > 0 && (
            <View className="absolute -top-1 -right-2 bg-red w-4 h-4 rounded-full items-center justify-center">
              <Text className="text-white text-[10px] font-dm-bold text-center leading-[14px]">
                {cartCount}
              </Text>
            </View>
          )}
        </View>
      );
    case "profile":
      return (
        <ProfileIcon
          width={TAB_ICON_SIZES.profile.width}
          height={TAB_ICON_SIZES.profile.height}
        />
      );
    default:
      return null;
  }
}

/**
 * Custom Floating Glassmorphic Tab Bar Component
 */
const FloatingTabBar = memo(function FloatingTabBar(props: CustomTabBarProps) {
  const {
    bottomPosition,
    visibleRoutes,
    isRouteFocused,
    handleTabPress,
    handleTabLongPress,
    getTabLabel,
    cartCount,
  } = useFloatingTabBar(props);

  const { descriptors } = props;

  return (
    <View
      style={[
        styles.floatingContainer,
        {
          bottom: bottomPosition,
        },
      ]}
    >
      {/* Translucent Frosted Glass Capsule Background with Blur Effect */}
      <View style={[StyleSheet.absoluteFill, styles.glassBackground]}>
        <BlurView
          intensity={TAB_BAR_BLUR_INTENSITY}
          tint={TAB_BAR_BLUR_TINT}
          style={StyleSheet.absoluteFill}
        />
        {/* Exact #FFFFFF 56% translucent overlay from design spec */}
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.semi_transparent_white },
          ]}
        />
      </View>

      {/* Tab Items Row */}
      <View className="flex-row items-center justify-between w-full h-[68px] px-2">
        {visibleRoutes.map((route: TabRoute) => {
          const isFocused = isRouteFocused(route);
          const options = descriptors[route.key]?.options ?? {};
          const label = getTabLabel(route);

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={() => handleTabPress(route, isFocused)}
              onLongPress={() => handleTabLongPress(route)}
              className="flex-1 items-center justify-center h-full"
            >
              <View style={[styles.pill, isFocused && styles.activePill]}>
                <View className="w-6 h-6 items-center justify-center">
                  {renderTabIcon(route.name, cartCount)}
                </View>
                <Text
                  className="font-dm-medium text-[10px] text-black text-center mt-[1px]"
                  style={{ includeFontPadding: false }}
                >
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      tabBar={(props) => (
        <FloatingTabBar
          state={props.state as any}
          descriptors={props.descriptors as any}
          navigation={props.navigation as any}
          insets={insets}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="catalogue"
        options={{
          title: "Catalogue",
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: "Category",
          href: null,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    left: TAB_BAR_HORIZONTAL_OFFSET,
    right: TAB_BAR_HORIZONTAL_OFFSET,
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_BORDER_RADIUS,
    ...TAB_BAR_SHADOW,
    boxShadow: TAB_BAR_BOX_SHADOW,
    alignItems: "center",
    justifyContent: "center",
  },
  glassBackground: {
    borderRadius: 34,
    borderWidth: 1,
    borderColor: TAB_BAR_BORDER_COLOR,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  pill: {
    width: TAB_PILL_WIDTH,
    height: TAB_PILL_HEIGHT,
    borderRadius: TAB_PILL_BORDER_RADIUS,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  activePill: {
    backgroundColor: TAB_ACTIVE_PILL_BG,
    borderRadius: TAB_PILL_BORDER_RADIUS,
    overflow: "hidden",
  },
});
