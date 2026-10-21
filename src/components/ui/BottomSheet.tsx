import React, { useCallback, useEffect } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const ANIMATION_DURATION = 320;

import type { BottomSheetProps } from "@/types";

export default function BottomSheet({

  visible,
  onClose,
  children,
  snapHeight = 0.55,
}: BottomSheetProps) {
  const sheetHeight = SCREEN_HEIGHT * snapHeight;
  const translateY = useSharedValue(sheetHeight);
  const backdropOpacity = useSharedValue(0);

  const open = useCallback(() => {
    translateY.value = withTiming(0, { duration: ANIMATION_DURATION });
    backdropOpacity.value = withTiming(1, { duration: ANIMATION_DURATION });
  }, [translateY, backdropOpacity]);

  const close = useCallback(() => {
    Keyboard.dismiss();
    translateY.value = withTiming(sheetHeight, { duration: ANIMATION_DURATION });
    backdropOpacity.value = withTiming(0, { duration: ANIMATION_DURATION }, () => {
      runOnJS(onClose)();
    });
  }, [translateY, backdropOpacity, sheetHeight, onClose]);

  useEffect(() => {
    if (visible) {
      open();
    } else {
      translateY.value = sheetHeight;
      backdropOpacity.value = 0;
    }
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={close}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={styles.flex} onPress={close} />
        </Animated.View>

        {/* Sheet */}
        <Animated.View style={[styles.sheet, { height: sheetHeight }, sheetStyle]}>
          {/* Drag handle */}
          <View style={styles.handle} />
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d4d4d4",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});
