import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Universal safe wrapper around expo-haptics to handle platform limitations,
 * web fallbacks, and prevent unhandled promise rejections.
 */
export const haptics = {
  /**
   * Light vibration - ideal for lazyload start, tab switches, and subtle interactions.
   */
  light: async (): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {
      // Ignore if device does not support haptics
    }
  },

  /**
   * Medium vibration - ideal for pull-to-refresh triggers, toggle switches, or modal opens.
   */
  medium: async (): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch {
      // Ignore if device does not support haptics
    }
  },

  /**
   * Heavy vibration - ideal for critical actions, deletes, or significant state shifts.
   */
  heavy: async (): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch {
      // Ignore if device does not support haptics
    }
  },

  /**
   * Rigid vibration - sharp, solid, crisp mechanical click/tap with hard tactile response.
   */
  rigid: async (): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
      }
    } catch {
      // Ignore if device does not support haptics
    }
  },

  /**
   * Hard vibration - strong, prominent tactile response with audible physical haptic feedback.
   */
  hard: async (): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch {
      // Ignore if device does not support haptics
    }
  },

  /**
   * Soft vibration - gentle tactile feedback.
   */
  soft: async (): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      }
    } catch {
      // Ignore if device does not support haptics
    }
  },

  /**
   * Selection feedback - ideal for picker wheel, item selection, or subtle clicks.
   */
  selection: async (): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.selectionAsync();
      }
    } catch {
      // Ignore if device does not support haptics
    }
  },

  /**
   * Success notification vibration - e.g. after API data loaded successfully.
   */
  success: async (): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      // Ignore if device does not support haptics
    }
  },

  /**
   * Warning notification vibration - e.g. network retry or partial data.
   */
  warning: async (): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch {
      // Ignore if device does not support haptics
    }
  },

  /**
   * Error notification vibration - e.g. API request failure or validation error.
   */
  error: async (): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch {
      // Ignore if device does not support haptics
    }
  },

  // ----------------------------------------------------
  // Context-specific loading & API haptic presets
  // ----------------------------------------------------

  /**
   * Triggered when lazy loading begins (hard tactile feedback).
   */
  onLazyLoadStart: async (): Promise<void> => {
    await haptics.heavy();
  },

  /**
   * Triggered when lazy loaded batch successfully completes and renders.
   */
  onLazyLoadSuccess: async (): Promise<void> => {
    await haptics.heavy();
  },

  /**
   * Triggered when an API request / data fetch starts loading.
   */
  onApiLoadStart: async (): Promise<void> => {
    await haptics.heavy();
  },

  /**
   * Triggered when an API request successfully finishes.
   */
  onApiLoadSuccess: async (): Promise<void> => {
    await haptics.success();
  },

  /**
   * Triggered when an API request fails.
   */
  onApiLoadError: async (): Promise<void> => {
    await haptics.error();
  },

  /**
   * Triggered when an item is added to cart or quantity incremented.
   * Uses Error notification vibration pattern as requested.
   */
  onAddToCart: async (): Promise<void> => {
    await haptics.error();
  },
};

/**
 * Wraps any asynchronous API call or promise with haptic feedback
 * on load start, load success, and load error.
 *
 * Example:
 * ```ts
 * const data = await withHapticLoading(() => fetchProducts(page));
 * ```
 */
export async function withHapticLoading<T>(
  asyncFn: () => Promise<T>,
  options?: {
    onStart?: boolean;
    onSuccess?: boolean;
    onError?: boolean;
  }
): Promise<T> {
  const { onStart = true, onSuccess = true, onError = true } = options || {};

  if (onStart) {
    await haptics.onApiLoadStart();
  }

  try {
    const result = await asyncFn();
    if (onSuccess) {
      await haptics.onApiLoadSuccess();
    }
    return result;
  } catch (err) {
    if (onError) {
      await haptics.onApiLoadError();
    }
    throw err;
  }
}
