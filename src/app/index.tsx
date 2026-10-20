import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import AppButton from '../components/ui/AppButton';

export default function WelcomeScreen() {
  const handleSignIn = () => {
    console.log('Sign in pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-between">
      {/* ── CENTER BRANDING ── */}
      <View className="flex-1 items-center justify-center">
        <View className="flex-row items-center gap-3">
          <Image
            source={require('../../assets/images/Logo.png')}
            style={{ width: 38, height: 38 }}
            contentFit="contain"
          />
          <Text className="text-[34px] font-dm-bold text-primary tracking-tight">
            ZeroQue
          </Text>
        </View>
      </View>

      {/* ── BOTTOM ACTIONS ── */}
      <View className="px-6 pb-6 w-full">
        <AppButton
          variant="solid"
          size="lg"
          label="Sign in"
          fullWidth
          onPress={handleSignIn}
        />

        <Text className="text-center text-xs font-dm-regular text-gray mt-5 leading-5">
          By proceeding to use ZeroQue, you agree to our{' '}
          <Text className="underline text-gray">terms of service</Text>
          {'\n'}and{' '}
          <Text className="underline text-gray">privacy policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
