import * as Haptics from "expo-haptics";
import { Platform, Vibration } from "react-native";

let activePulseInterval: ReturnType<typeof setInterval> | null = null;
let lastTriggerTime = 0;
const DEBOUNCE_THRESHOLD_MS = 25;

function triggerVibration(
  androidPattern: number | number[],
  iosAction: () => Promise<void>
): void {
  const now = Date.now();
  if (now - lastTriggerTime < DEBOUNCE_THRESHOLD_MS) {
    return;
  }
  lastTriggerTime = now;

  if (Platform.OS === "android") {
    try {
      Vibration.vibrate(androidPattern);
    } catch {
      iosAction().catch(() => {});
    }
  } else if (Platform.OS === "ios") {
    iosAction().catch(() => {});
  }
}


export const haptics = {
  /**
   * Light vibration - ideal for subtle interactions, stepper decrements, and tab switches.
   */
  light: async (): Promise<void> => {
    triggerVibration(25, () =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    );
  },

  /**
   * Medium vibration - ideal for pull-to-refresh triggers, toggle switches, or modal opens.
   */
  medium: async (): Promise<void> => {
    triggerVibration(40, () =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    );
  },

  /**
   * Heavy vibration - ideal for critical actions, deletes, or significant state shifts.
   */
  heavy: async (): Promise<void> => {
    triggerVibration(65, () =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    );
  },

  /**
   * Rigid vibration - sharp, solid, crisp mechanical click/tap with hard tactile response.
   */
  rigid: async (): Promise<void> => {
    triggerVibration(35, () =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
    );
  },

  /**
   * Hard vibration - strong, prominent tactile response with audible physical haptic feedback.
   */
  hard: async (): Promise<void> => {
    triggerVibration(70, () =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    );
  },

  /**
   * Soft vibration - gentle tactile feedback.
   */
  soft: async (): Promise<void> => {
    triggerVibration(20, () =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
    );
  },

  /**
   * Selection feedback - ideal for picker wheel, item selection, or subtle clicks.
   */
  selection: async (): Promise<void> => {
    triggerVibration(15, () => Haptics.selectionAsync());
  },

  /**
   * Success notification vibration - e.g. after API data loaded successfully.
   * Produces a two-pulse confirmation pattern.
   */
  success: async (): Promise<void> => {
    triggerVibration([0, 50, 70, 60], () =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    );
  },

  /**
   * Warning notification vibration - e.g. network retry or partial data.
   */
  warning: async (): Promise<void> => {
    triggerVibration([0, 60, 60, 60], () =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    );
  },

  /**
   * Error notification vibration - e.g. API request failure or validation error.
   * Produces a distinct three-pulse warning pattern.
   */
  error: async (): Promise<void> => {
    triggerVibration([0, 60, 50, 60, 50, 60], () =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    );
  },

  // ----------------------------------------------------
  // Continuous & Loading Vibration Controls
  // ----------------------------------------------------


  startLoadingPulse: (intervalMs: number = 280): (() => void) => {
    haptics.stopLoadingPulse();

    if (Platform.OS === "android") {
      try {
        // Continuous pulsing pattern: 120ms vibrate, 180ms pause, repeating indefinitely
        Vibration.vibrate([0, 120, 180], true);
      } catch {
        // Fallback to interval if repeating Vibration pattern is unavailable
        activePulseInterval = setInterval(() => {
          haptics.medium();
        }, intervalMs);
      }
    } else if (Platform.OS === "ios") {
      // Immediate tactile cue on iOS Taptic Engine
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      activePulseInterval = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      }, intervalMs);
    }

    return () => {
      haptics.stopLoadingPulse();
    };
  },

  /**
   * Immediately stops any ongoing loading pulse or vibration.
   */
  stopLoadingPulse: (): void => {
    if (activePulseInterval) {
      clearInterval(activePulseInterval);
      activePulseInterval = null;
    }
    try {
      if (Platform.OS !== "web") {
        Vibration.cancel();
      }
    } catch {
      // Ignore
    }
  },


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


  onSignInStart: (intervalMs: number = 280): (() => void) => {
    return haptics.startLoadingPulse(intervalMs);
  },

  /**
   * Triggered when signing in loading finishes (before success/error feedback).
   */
  onSignInEnd: (): void => {
    haptics.stopLoadingPulse();
  },

  /**
   * Triggered when signing in completes successfully.
   * Stops the ongoing loading pulse, lets the hardware reset,
   * then delivers distinct success feedback before navigating.
   */
  onSignInSuccess: async (): Promise<void> => {
    haptics.stopLoadingPulse();
    if (Platform.OS === "android") {
      // 60ms delay ensures Android IPC binder cancellation completes
      // so the success pattern is not swallowed by cancel()
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    await haptics.success();
  },

  /**
   * Triggered when signing in or verification fails.
   * Stops the loading pulse, lets the hardware reset,
   * then delivers distinct error feedback.
   */
  onSignInError: async (): Promise<void> => {
    haptics.stopLoadingPulse();
    if (Platform.OS === "android") {
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
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
