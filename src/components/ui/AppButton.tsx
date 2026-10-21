
import { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
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


const paddingMap: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
};

const textSizeMap: Record<ButtonSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const stepperSizeMap: Record<ButtonSize, { btn: string; text: string; num: string }> = {
  sm: { btn: 'w-7 h-7',   text: 'text-base', num: 'text-xs min-w-[20px]' },
  md: { btn: 'w-9 h-9',   text: 'text-xl',   num: 'text-sm min-w-[24px]' },
  lg: { btn: 'w-11 h-11', text: 'text-2xl',  num: 'text-base min-w-[28px]' },
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
  } = props;

  const variantClass: Record<string, string> = {
    solid:   'bg-primary rounded-xl',
    outline: 'border border-border rounded-xl bg-white',
    ghost:   'bg-transparent',
    secondary:'bg-secondary rounded-xl',
  };

  const textClass: Record<string, string> = {
    solid:   'text-white',
    outline: 'text-black',
    ghost:   'text-black',
    secondary:'text-blue'
  };

  const imgSizeMap: Record<ButtonSize, number> = { sm: 28, md: 36, lg: 44 };
  const imgSize = imgSizeMap[size];

  const opacity = disabled || loading ? 'opacity-50' : '';
  const width   = fullWidth ? 'w-full' : 'self-start';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      className={`flex-row items-center justify-center ${variantClass[variant]} ${paddingMap[size]} ${opacity} ${width}`}
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
              className="rounded-full overflow-hidden bg-surface mr-2"
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


function IconButton({ label, icon, onPress, size = 'lg', disabled = false }: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      className={`flex-row items-center justify-center gap-1.5 border border-gray/40 rounded-xl w-[88px] h-[42px] ${disabled ? 'opacity-50' : ''}`}
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

  if (count <= 0) {
    return (
      <TouchableOpacity
        onPress={() => update(Math.max(1, min))}
        disabled={disabled || 1 > max}
        activeOpacity={0.7}
        className={`items-center justify-center bg-primary rounded-full ${s.btn} ${opacity}`}
      >
        <Text className={`text-white font-dm-bold leading-none ${s.text}`}>+</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View className={`flex-row items-center bg-primary rounded-full overflow-hidden ${opacity}`}>
      <TouchableOpacity
        onPress={() => update(count - 1)}
        disabled={disabled || count - 1 < min}
        activeOpacity={0.7}
        className={`${s.btn} items-center justify-center`}
      >
        <Text className={`text-white font-dm-bold leading-none ${s.text}`}>−</Text>
      </TouchableOpacity>

      <Text className={`text-white font-dm-semibold text-center ${s.num}`}>
        {count}
      </Text>

      <TouchableOpacity
        onPress={() => update(count + 1)}
        disabled={disabled || count >= max}
        activeOpacity={0.7}
        className={`${s.btn} items-center justify-center`}
      >
        <Text className={`text-white font-dm-bold leading-none ${s.text}`}>+</Text>
      </TouchableOpacity>
    </View>
  );
}


export default function AppButton(props: AppButtonProps) {
  if (props.variant === 'stepper') return <StepperButton {...props} />;
  if (props.variant === 'icon')    return <IconButton    {...props} />;
  return <StandardButton {...(props as SolidOutlineGhostProps)} />;
}
