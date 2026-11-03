import React, { memo, useCallback, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { MinusIcon, PlusIcon } from "@/assets";
import { useLoadingHaptics } from "@/hooks";
import { haptics } from "@/utils/haptics";
import { colors } from "@/themes/colors";
import type {
  AppButtonProps,
  BaseProps,
  ButtonSize,
  ButtonVariant,
  HapticFeedbackType,
  IconButtonProps,
  SolidOutlineGhostProps,
  StepperProps,
} from "@/types";

export type {
  ButtonVariant,
  ButtonSize,
  BaseProps,
  SolidOutlineGhostProps,
  IconButtonProps,
  StepperProps,
  AppButtonProps,
  HapticFeedbackType,
};

const PADDING_CLASS_MAP: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5",
  md: "px-3.5 py-2",
  lg: "px-4 py-4",
};

const TEXT_SIZE_CLASS_MAP: Record<ButtonSize, string> = {
  sm: "text-xs",
  md: "text-[15px]",
  lg: "text-base",
};

const VARIANT_CLASS_MAP: Record<string, string> = {
  solid: "bg-primary rounded-xl",
  outline: "border border-border rounded-2xl bg-white",
  ghost: "bg-transparent",
  secondary: "bg-secondary rounded-xl",
};

const TEXT_COLOR_CLASS_MAP: Record<string, string> = {
  solid: "text-white",
  outline: "text-black",
  ghost: "text-black",
  secondary: "text-blue",
};

const IMAGE_SIZE_MAP: Record<ButtonSize, number> = {
  sm: 28,
  md: 36,
  lg: 44,
};

const STEPPER_SIZE_MAP: Record<
  ButtonSize,
  {
    circleBtn: string;
    stepBtn: string;
    text: string;
    num: string;
    container: string;
    iconSize: number;
  }
> = {
  sm: {
    circleBtn: "w-7 h-7",
    stepBtn: "w-5 h-5",
    text: "text-xs",
    num: "text-[11px] min-w-[16px] px-1",
    container: "px-1 py-0.5",
    iconSize: 12,
  },
  md: {
    circleBtn: "w-[40px] h-[40px]",
    stepBtn: "w-8 h-8",
    text: "text-base",
    num: "text-[16px] leading-[20px] min-w-[24px]",
    container: "w-[102px] h-[40px] px-1 justify-between",
    iconSize: 14,
  },
  lg: {
    circleBtn: "w-12 h-12",
    stepBtn: "w-9 h-9",
    text: "text-xl",
    num: "text-base min-w-[26px] px-2",
    container: "w-[120px] h-[48px] px-2 justify-between",
    iconSize: 18,
  },
};

const StandardButton = memo(function StandardButton(
  props: SolidOutlineGhostProps,
) {
  const {
    variant = "solid",
    size = "md",
    label,
    onPress,
    disabled = false,
    loading = false,
    haptic,
    leftIcon,
    rightIcon,
    fullWidth = false,
    image,
    className = "",
    style,
    textStyle,
    textClassName,
  } = props;

  const imageSize = IMAGE_SIZE_MAP[size];

  useLoadingHaptics(Boolean(loading), {
    vibrateOnStart: true,
    startType: "light",
  });

  const opacityClass = disabled || loading ? "opacity-50" : "";
  const widthClass = fullWidth ? "w-full" : "self-start";

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    if (haptic === false) {
      // Disabled haptics
    } else if (typeof haptic === "string" && haptic in haptics) {
      (haptics as any)[haptic]();
    } else if (haptic === true || (label && /add/i.test(label))) {
      haptics.light();
    }
    onPress?.();
  }, [disabled, loading, haptic, label, onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={style}
      className={`flex-row items-center justify-center ${PADDING_CLASS_MAP[size]} ${VARIANT_CLASS_MAP[variant]} ${opacityClass} ${widthClass} ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "solid" ? colors.white : colors.primary}
        />
      ) : (
        <>
          {image && (
            <View
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: imageSize / 2,
              }}
              className="overflow-hidden mr-2 bg-surface items-center justify-center shrink-0"
            >
              <Image
                source={image}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>
          )}

          {leftIcon && <View className="mr-1.5">{leftIcon}</View>}

          <Text
            style={textStyle}
            className={`font-dm-semibold ${TEXT_SIZE_CLASS_MAP[size]} ${TEXT_COLOR_CLASS_MAP[variant]} ${textClassName ?? ""}`}
          >
            {label}
          </Text>

          {rightIcon && <View className="ml-1.5">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
});

const IconButton = memo(function IconButton({
  icon,
  label,
  onPress,
  size = "lg",
  disabled = false,
  haptic,
  className = "",
  style,
}: IconButtonProps) {
  const handlePress = useCallback(() => {
    if (disabled) return;
    if (haptic === false) {
      // Disabled haptics
    } else if (typeof haptic === "string" && haptic in haptics) {
      (haptics as any)[haptic]();
    } else if (haptic === true || (label && /add/i.test(label))) {
      haptics.light();
    }
    onPress();
  }, [disabled, haptic, label, onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.75}
      style={style}
      className={`flex-row items-center justify-center gap-1.5 border border-gray/40 rounded-xl w-[88px] h-[42px] ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {icon}
      <Text className={`font-dm-medium text-black ${TEXT_SIZE_CLASS_MAP[size]}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
});

const StepperButton = memo(function StepperButton({
  value: controlledValue,
  initialValue,
  min = 0,
  max = 99,
  size = "md",
  disabled = false,
  haptic,
  onValueChange,
  icon,
  label,
  className = "",
  style,
}: StepperProps) {
  const isControlled = controlledValue !== undefined;
  const [internalCount, setInternalCount] = useState(
    initialValue !== undefined ? initialValue : min > 0 ? min : 0,
  );
  const count = isControlled ? controlledValue : internalCount;

  const triggerHapticFeedback = useCallback(
    (isAdd: boolean) => {
      if (haptic === false) return;
      if (typeof haptic === "string" && haptic in haptics) {
        (haptics as any)[haptic]();
        return;
      }
      if (isAdd) {
        haptics.light();
      } else {
        haptics.light();
      }
    },
    [haptic],
  );

  const handleQuantityUpdate = useCallback(
    (nextCount: number) => {
      if (disabled || nextCount < min || nextCount > max) return;
      triggerHapticFeedback(nextCount > count);
      if (!isControlled) {
        setInternalCount(nextCount);
      }
      onValueChange?.(nextCount);
    },
    [disabled, min, max, count, triggerHapticFeedback, isControlled, onValueChange],
  );

  const stepperLayout = STEPPER_SIZE_MAP[size];
  const opacityClass = disabled ? "opacity-50" : "";

  // Flow: when count is 0, show label button (if provided) or '+' circle button
  if (count <= 0) {
    if (label) {
      return (
        <TouchableOpacity
          onPress={() => handleQuantityUpdate(Math.max(1, min))}
          disabled={disabled || 1 > max}
          activeOpacity={0.75}
          style={style}
          className={`flex-row items-center justify-center bg-primary rounded-xl ${opacityClass} ${className}`}
        >
          <Text className="font-dm-semibold text-[14px] text-white text-center">
            {label}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => handleQuantityUpdate(Math.max(1, min))}
        disabled={disabled || 1 > max}
        activeOpacity={0.7}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        style={style}
        className={`items-center justify-center bg-primary rounded-full ${stepperLayout.circleBtn} ${opacityClass} ${className}`}
      >
        {icon ? (
          icon
        ) : (
          <PlusIcon
            width={stepperLayout.iconSize}
            height={stepperLayout.iconSize}
            stroke={colors.white}
          />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={style}
      className={`flex-row items-center bg-primary rounded-full overflow-hidden ${stepperLayout.container} ${opacityClass} ${className}`}
    >
      <TouchableOpacity
        onPress={() => handleQuantityUpdate(count - 1)}
        disabled={disabled || count - 1 < min}
        activeOpacity={0.7}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        className={`${stepperLayout.stepBtn} items-center justify-center`}
      >
        <MinusIcon
          width={stepperLayout.iconSize}
          height={stepperLayout.iconSize}
          stroke={colors.white}
        />
      </TouchableOpacity>

      <Text
        style={{
          fontFamily: "DMSans_600SemiBold",
          fontSize: 16,
          lineHeight: 20,
          color: colors.white,
          includeFontPadding: false,
          textAlignVertical: "center",
        }}
        className={`text-white font-dm-semibold text-[16px] leading-[20px] text-center ${stepperLayout.num}`}
      >
        {count}
      </Text>

      <TouchableOpacity
        onPress={() => handleQuantityUpdate(count + 1)}
        disabled={disabled || count >= max}
        activeOpacity={0.7}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        className={`${stepperLayout.stepBtn} items-center justify-center`}
      >
        <PlusIcon
          width={stepperLayout.iconSize}
          height={stepperLayout.iconSize}
          stroke={colors.white}
        />
      </TouchableOpacity>
    </View>
  );
});

const AppButton = memo(function AppButton(props: AppButtonProps) {
  if (props.variant === "stepper") return <StepperButton {...props} />;
  if (props.variant === "icon") return <IconButton {...props} />;
  return <StandardButton {...(props as SolidOutlineGhostProps)} />;
});

export default AppButton;
