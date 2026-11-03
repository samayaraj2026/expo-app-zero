import React, { memo, type ReactNode } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  type SvgProps,
} from "react-native-svg";
import { PlusIcon } from "@/assets";
import { AppButton } from "@/components/ui";
import { colors } from "@/themes/colors";

export { PlusIcon } from "@/assets";

export interface SetupEmptyStateProps {
  illustration: ReactNode;
  title: string;
  description: string | ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    isLoading?: boolean;
    disabled?: boolean;
  };
  secondaryAction?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  isIllustrationLoading?: boolean;
}

/**
 * EmptyStateBackdropGraphic: Organic SVG blob backdrop for illustrations.
 */
export const EmptyStateBackdropGraphic = memo(
  function EmptyStateBackdropGraphic(props: SvgProps) {
    return (
      <Svg
        width={308}
        height={232}
        viewBox="0 0 308 232"
        fill="none"
        {...props}
      >
        <Defs>
          <LinearGradient
            id="paint0_linear_empty_blob"
            x1="62.042"
            y1="4.35541"
            x2="172.385"
            y2="222.626"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor={colors.emptyBlobStart} />
            <Stop offset="1" stopColor={colors.emptyBlobEnd} />
          </LinearGradient>
        </Defs>
        <Path
          d="M275.885 50.1257C237.434 18.8853 188.679 90.1568 155.515 59.1258C122.351 28.0948 78.403 -30.0332 18.3848 18.8231C-41.6335 67.6795 68.1276 115.116 26.5282 162.819C-8.17526 202.605 85.3856 246.626 155.515 226.219C235.051 203.076 251.341 222.354 280.188 199.581C320.041 168.12 312.958 80.2473 275.885 50.1257Z"
          fill="url(#paint0_linear_empty_blob)"
        />
      </Svg>
    );
  },
);

/**
 * EmptyStateBackdropBlob: Centered container framing an illustration with the organic blob backdrop.
 */
export const EmptyStateBackdropBlob = memo(function EmptyStateBackdropBlob({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <View style={styles.blobContainer}>
      <EmptyStateBackdropGraphic style={StyleSheet.absoluteFill} />
      {children ? <View style={styles.blobContent}>{children}</View> : null}
    </View>
  );
});

/**
 * SetupEmptyState: Production-ready enterprise empty state card with animated entrance,
 * backdrop illustration container, header typography, and action buttons.
 */
export const SetupEmptyState = memo(function SetupEmptyState({
  illustration,
  title,
  description,
  action,
  secondaryAction,
  className = "",
  style,
  isIllustrationLoading = false,
}: SetupEmptyStateProps) {
  const cleanLabel = action?.label.replace(/^\+\s*/, "") ?? "";
  const hasAdd = cleanLabel.toLowerCase().includes("add");

  return (
    <Animated.View
      entering={FadeInDown.duration(260)}
      style={[styles.card, style]}
      className={className}
    >
      {/* Illustration Showcase Box */}
      <View style={styles.illustrationBox}>
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.emptyBlobStart} />
              <Stop offset="100%" stopColor={colors.emptyBlobEnd} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#boxGrad)" />
        </Svg>

        {isIllustrationLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.center}>{illustration}</View>
        )}
      </View>

      {/* Title & Description */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {typeof description === "string" ? (
          <Text style={styles.description}>{description}</Text>
        ) : (
          description
        )}
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionContainer}>
        {action && (
          <AppButton
            variant="solid"
            size="md"
            label={cleanLabel}
            onPress={action.onClick}
            loading={action.isLoading}
            disabled={action.disabled}
            leftIcon={
              action.icon ??
              (hasAdd ? (
                <PlusIcon width={16} height={16} stroke={colors.white} />
              ) : undefined)
            }
          />
        )}
        {secondaryAction}
      </View>
    </Animated.View>
  );
});

export default SetupEmptyState;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: "center",
    alignSelf: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  illustrationBox: {
    width: "100%",
    maxWidth: 396,
    height: 240,
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  center: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  blobContainer: {
    width: 308,
    height: 232,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  blobContent: {
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: "DMSans-Bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    fontFamily: "DMSans-Regular",
    color: colors.neutral500,
    textAlign: "center",
    lineHeight: 18,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    flexWrap: "wrap",
  },
});
