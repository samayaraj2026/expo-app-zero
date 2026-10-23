import { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { MinusIcon, PlusIcon } from '@/assets';
import type {
  ButtonVariant,
  ButtonSize,
  BaseProps,
  SolidOutlineGhostProps,
  IconButtonProps,
  StepperProps,
  AppButtonProps,
} from '@/types';

export type {
  ButtonVariant,
  ButtonSize,
  BaseProps,
  SolidOutlineGhostProps,
  IconButtonProps,
  StepperProps,
  AppButtonProps,
};

// ─── Size maps ────────────────────────────────────────────────────────────────

const paddingMap: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-3.5 py-2',
  lg: 'px-4 py-4',
};

const textSizeMap: Record<ButtonSize, string> = {
  sm: 'text-xs',
  md: 'text-[15px]',
  lg: 'text-base',
};

const stepperSizeMap: Record<
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
    circleBtn: 'w-7 h-7',
    stepBtn: 'w-5 h-5',
    text: 'text-xs',
    num: 'text-[11px] min-w-[16px] px-1',
    container: 'px-1 py-0.5',
    iconSize: 12,
  },
  md: {
    circleBtn: 'w-[40px] h-[40px]',
    stepBtn: 'w-8 h-8',
    text: 'text-base',
    num: 'text-[16px] leading-[20px] min-w-[24px]',
    container: 'w-[102px] h-[40px] px-1 justify-between',
    iconSize: 14,
  },
  lg: {
    circleBtn: 'w-12 h-12',
    stepBtn: 'w-9 h-9',
    text: 'text-xl',
    num: 'text-base min-w-[26px] px-2',
    container: 'w-[120px] h-[48px] px-2 justify-between',
    iconSize: 18,
  },
};

function StandardButton(props: SolidOutlineGhostProps) {
  const {
    variant = 'solid',
    size = 'md',
    label,
    onPress,
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    image,
    className = '',
    style,
  } = props;

  const variantClass: Record<string, string> = {
    solid: 'bg-primary rounded-xl',
    outline: 'border border-border rounded-2xl bg-white',
    ghost: 'bg-transparent',
    secondary: 'bg-secondary rounded-xl',
  };

  const textClass: Record<string, string> = {
    solid: 'text-white',
    outline: 'text-black',
    ghost: 'text-black',
    secondary: 'text-blue'
  };

  const imgSizeMap: Record<ButtonSize, number> = { sm: 28, md: 36, lg: 44 };
  const imgSize = imgSizeMap[size];

  const opacity = disabled || loading ? 'opacity-50' : '';
  const width = fullWidth ? 'w-full' : 'self-start';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={style}
      className={`flex-row items-center justify-center ${variantClass[variant]} ${paddingMap[size]} ${opacity} ${width} ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'solid' ? '#FFFFFF' : '#162456'}
        />
      ) : (
        <>
          {image && (
            <View
              className="rounded-full overflow-hidden bg-surface mr-3"
              style={{ width: imgSize, height: imgSize }}
            >
              <Image
                source={image}
                style={{ width: imgSize, height: imgSize }}
                contentFit="cover"
              />
            </View>
          )}
          {!image && leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text className={`font-dm-semibold ${textSizeMap[size]} ${textClass[variant]}`}>
            {label}
          </Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}

function IconButton({
  label,
  icon,
  onPress,
  size = 'lg',
  disabled = false,
  className = '',
  style,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={style}
      className={`flex-row items-center justify-center gap-1.5 border border-gray/40 rounded-xl w-[88px] h-[42px] ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {icon}
      <Text className={`font-dm-medium text-black ${textSizeMap[size]}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function StepperButton({
  value: controlledValue,
  initialValue,
  min = 0,
  max = 99,
  size = 'md',
  disabled = false,
  onValueChange,
  icon,
  label,
  className = '',
  style,
}: StepperProps) {
  const isControlled = controlledValue !== undefined;
  const [internalCount, setInternalCount] = useState(
    initialValue !== undefined ? initialValue : (min > 0 ? min : 0)
  );
  const count = isControlled ? controlledValue : internalCount;

  const update = (next: number) => {
    if (disabled || next < min || next > max) return;
    if (!isControlled) {
      setInternalCount(next);
    }
    onValueChange?.(next);
  };

  const s = stepperSizeMap[size];
  const opacity = disabled ? 'opacity-50' : '';

  // Flow: when count is 0, show label button (if provided) or '+' circle button
  if (count <= 0) {
    if (label) {
      return (
        <TouchableOpacity
          onPress={() => update(Math.max(1, min))}
          disabled={disabled || 1 > max}
          activeOpacity={0.75}
          style={style}
          className={`flex-row items-center justify-center bg-primary rounded-xl ${opacity} ${className}`}
        >
          <Text
            className="font-dm-semibold text-[14px] text-white text-center"
          >
            {label}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => update(Math.max(1, min))}
        disabled={disabled || 1 > max}
        activeOpacity={0.7}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        style={style}
        className={`items-center justify-center bg-primary rounded-full ${s.circleBtn} ${opacity} ${className}`}
      >
        {icon ? (
          icon
        ) : (
          <PlusIcon width={s.iconSize} height={s.iconSize} stroke="#FFFFFF" />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={style}
      className={`flex-row items-center bg-primary rounded-full overflow-hidden ${s.container} ${opacity} ${className}`}
    >
      <TouchableOpacity
        onPress={() => update(count - 1)}
        disabled={disabled || count - 1 < min}
        activeOpacity={0.7}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        className={`${s.stepBtn} items-center justify-center`}
      >
        <MinusIcon width={s.iconSize} height={s.iconSize} stroke="#FFFFFF" />
      </TouchableOpacity>

      <Text
        style={{
          fontFamily: 'DMSans_600SemiBold',
          fontSize: 16,
          lineHeight: 20,
          color: '#FFFFFF',
          includeFontPadding: false,
          textAlignVertical: 'center',
        }}
        className={`text-white font-dm-semibold text-[16px] leading-[20px] text-center ${s.num}`}
      >
        {count}
      </Text>

      <TouchableOpacity
        onPress={() => update(count + 1)}
        disabled={disabled || count >= max}
        activeOpacity={0.7}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        className={`${s.stepBtn} items-center justify-center`}
      >
        <PlusIcon width={s.iconSize} height={s.iconSize} stroke="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

export default function AppButton(props: AppButtonProps) {
  if (props.variant === 'stepper') return <StepperButton {...props} />;
  if (props.variant === 'icon') return <IconButton    {...props} />;
  return <StandardButton {...(props as SolidOutlineGhostProps)} />;
}
