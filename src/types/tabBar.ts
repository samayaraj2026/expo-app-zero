import type { EdgeInsets } from "react-native-safe-area-context";

export type TabName = "home" | "catalogue" | "category" | "cart" | "profile";

export interface TabRoute {
  key: string;
  name: string;
  params?: Record<string, unknown>;
}

export interface TabNavigationEvent {
  type: string;
  target: string;
  canPreventDefault?: boolean;
}

export interface TabDescriptorOptions {
  href?: string | null;
  title?: string;
  tabBarLabel?: string;
  tabBarAccessibilityLabel?: string;
  tabBarButtonTestID?: string;
  [key: string]: unknown;
}

export interface TabDescriptor {
  key?: string;
  options: TabDescriptorOptions;
  [key: string]: unknown;
}

export interface TabNavigationState {
  index: number;
  routes: TabRoute[];
}

export interface TabNavigationHelpers {
  emit: (event: TabNavigationEvent) => { defaultPrevented: boolean };
  navigate: (name: string, params?: Record<string, unknown>) => void;
}

export interface CustomTabBarProps {
  state: TabNavigationState;
  descriptors: Record<string, TabDescriptor>;
  navigation: TabNavigationHelpers;
  insets: EdgeInsets;
}

export interface FloatingTabBarHookResult {
  bottomPosition: number;
  visibleRoutes: TabRoute[];
  isRouteFocused: (route: TabRoute) => boolean;
  handleTabPress: (route: TabRoute, isFocused: boolean) => void;
  handleTabLongPress: (route: TabRoute) => void;
  getTabLabel: (route: TabRoute) => string;
  cartCount: number;
}
