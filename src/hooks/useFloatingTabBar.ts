import { useCallback, useMemo } from 'react';
import {
  DEFAULT_CART_COUNT,
  TAB_BAR_BOTTOM_SPACING,
  TAB_BAR_MIN_BOTTOM,
} from '@/constants/tabBar';
import type {
  CustomTabBarProps,
  FloatingTabBarHookResult,
  TabRoute,
} from '@/types/tabBar';

/**
 * Custom hook encapsulating navigation state, positioning calculations,
 * and event handlers for the floating tab bar.
 */
export function useFloatingTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: CustomTabBarProps): FloatingTabBarHookResult {
  const cartCount = DEFAULT_CART_COUNT;

  // Floating bottom spacing respecting device safe areas with clear breathing room
  const bottomPosition = useMemo(
    () => Math.max((insets?.bottom ?? 0) + TAB_BAR_BOTTOM_SPACING, TAB_BAR_MIN_BOTTOM),
    [insets?.bottom]
  );

  const activeRoute = state.routes[state.index];
  const activeRouteName = activeRoute?.name;

  // Only render the primary visible tabs (category screen is a subscreen within catalogue)
  const visibleRoutes = useMemo(
    () =>
      state.routes.filter(
        (route) =>
          descriptors[route.key]?.options?.href !== null && route.name !== 'category'
      ),
    [state.routes, descriptors]
  );

  const isRouteFocused = useCallback(
    (route: TabRoute): boolean => {
      const isCatalogueFocused =
        route.name === 'catalogue' &&
        (activeRouteName === 'catalogue' || activeRouteName === 'category');
      return isCatalogueFocused || activeRouteName === route.name;
    },
    [activeRouteName]
  );

  const handleTabPress = useCallback(
    (route: TabRoute, isFocused: boolean): void => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    },
    [navigation]
  );

  const handleTabLongPress = useCallback(
    (route: TabRoute): void => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    },
    [navigation]
  );

  const getTabLabel = useCallback(
    (route: TabRoute): string => {
      const options = descriptors[route.key]?.options;
      if (!options) return route.name;

      const rawLabel =
        options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

      if (typeof rawLabel === 'string') {
        return rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
      }
      return String(rawLabel);
    },
    [descriptors]
  );

  return {
    bottomPosition,
    visibleRoutes,
    isRouteFocused,
    handleTabPress,
    handleTabLongPress,
    getTabLabel,
    cartCount,
  };
}
