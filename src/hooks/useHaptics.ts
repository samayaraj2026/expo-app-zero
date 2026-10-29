import { useCallback, useEffect, useRef, useState } from "react";
import { haptics } from "@/utils/haptics";

export interface LoadingHapticsOptions {
  /**
   * Whether to vibrate when loading begins. Defaults to true.
   */
  vibrateOnStart?: boolean;
  /**
   * Haptic style when loading begins. Defaults to 'heavy'.
   */
  startType?:
    | "heavy"
    | "rigid"
    | "hard"
    | "medium"
    | "light"
    | "soft"
    | "selection"
    | "error"
    | "success";
  /**
   * Whether to vibrate when loading completes. Defaults to false.
   */
  vibrateOnComplete?: boolean;
  /**
   * Haptic style when loading completes. Defaults to 'heavy'.
   */
  completeType?:
    | "heavy"
    | "rigid"
    | "hard"
    | "success"
    | "error"
    | "selection"
    | "light";
}

/**
 * Hook to automatically trigger haptic vibrations when a loading state changes
 * (e.g. lazy loading more list items, pull-to-refresh, or API requests).
 */
export function useLoadingHaptics(
  isLoading: boolean,
  options?: LoadingHapticsOptions
) {
  const {
    vibrateOnStart = true,
    startType = "heavy",
    vibrateOnComplete = false,
    completeType = "heavy",
  } = options || {};

  const prevLoadingRef = useRef<boolean>(isLoading);

  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    prevLoadingRef.current = isLoading;

    // Started loading
    if (!wasLoading && isLoading && vibrateOnStart) {
      if (startType === "error") haptics.error();
      else if (startType === "success") haptics.success();
      else if (startType === "heavy" || startType === "hard") haptics.heavy();
      else if (startType === "rigid") haptics.rigid();
      else if (startType === "medium") haptics.medium();
      else if (startType === "light") haptics.light();
      else if (startType === "soft") haptics.soft();
      else if (startType === "selection") haptics.selection();
    }

    // Finished loading
    if (wasLoading && !isLoading && vibrateOnComplete) {
      if (completeType === "error") haptics.error();
      else if (completeType === "heavy" || completeType === "hard") haptics.heavy();
      else if (completeType === "rigid") haptics.rigid();
      else if (completeType === "success") haptics.success();
      else if (completeType === "selection") haptics.selection();
      else if (completeType === "light") haptics.light();
    }
  }, [isLoading, vibrateOnStart, startType, vibrateOnComplete, completeType]);
}

/**
 * Hook for executing asynchronous API calls with automatic haptic feedback
 * on load start, load success, and load error.
 */
export function useAsyncWithHaptics<T, P extends any[] = any[]>(
  asyncFn: (...args: P) => Promise<T>,
  options?: {
    onStart?: boolean;
    onSuccess?: boolean;
    onError?: boolean;
  }
) {
  const { onStart = true, onSuccess = true, onError = true } = options || {};

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  const execute = useCallback(
    async (...args: P): Promise<T> => {
      setLoading(true);
      setError(null);

      if (onStart) {
        await haptics.onApiLoadStart();
      }

      try {
        const result = await asyncFn(...args);
        setData(result);
        if (onSuccess) {
          await haptics.onApiLoadSuccess();
        }
        return result;
      } catch (err) {
        setError(err);
        if (onError) {
          await haptics.onApiLoadError();
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn, onStart, onSuccess, onError]
  );

  return {
    execute,
    loading,
    data,
    error,
    setData,
  };
}

/**
 * Hook exposing haptic methods directly.
 */
export function useHaptics() {
  return haptics;
}
