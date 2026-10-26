import {
  AppIcon,
  BackIcon,
  CloseIcon,
  CollapseIcon,
  ExportIcon,
  RefreshIcon,
  UnlinkIcon,
} from "@/assets";
import AppButton from "@/components/ui/AppButton";
import { FloatingTextInput } from "@/components/ui/FloatingTextInput";
import { PasswordTextInput } from "@/components/ui/PasswordTextInput";
import { colors } from "@/themes/colors";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import type { SignInStep, SignInBottomSheetProps } from "@/types";

export type { SignInStep, SignInBottomSheetProps };

export default function SignInBottomSheet({
  sheetRef,
}: SignInBottomSheetProps) {
  const [step, setStep] = useState<SignInStep>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName] = useState("Sarah Jones");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const snapPoints = useMemo(() => ["65%", "85%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const handleClose = () => {
    Keyboard.dismiss();
    sheetRef.current?.close();
  };

  const handleSheetChange = (index: number) => {
    if (index === -1) {
      setStep("email");
      setEmail("");
      setEmailError("");
      setOtp("");
      setCreatePassword("");
      setConfirmPassword("");
    }
  };

  const handleEmailContinue = () => {
    Keyboard.dismiss();
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Email address is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setStep("otp");
  };

  const handleVerifyOtp = () => {
    Keyboard.dismiss();
    if (otp) {
      // OTP verified
    }
    setStep("setPassword");
  };

  const handlePasswordContinue = () => {
    Keyboard.dismiss();
    setStep("signingIn");
  };

  useEffect(() => {
    if (step === "signingIn") {
      const timer = setTimeout(() => {
        // Static password validation against "zeroque"
        if (createPassword.trim() === "zeroque") {
          sheetRef.current?.close();
          router.push("/cataloguescreen");
        } else {
          setStep("expiredInvite");
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [step, createPassword, sheetRef]);

  const handleExpiredContinue = () => {
    Keyboard.dismiss();
    setStep("email");
  };

  const handleBack = () => {
    Keyboard.dismiss();
    if (step === "expiredInvite") {
      setStep("setPassword");
    } else if (step === "signingIn") {
      setStep("setPassword");
    } else if (step === "setPassword") {
      setStep("otp");
    } else if (step === "otp") {
      setStep("email");
    } else {
      sheetRef.current?.close();
    }
  };

  const displayEmail = email.trim() || "sarah.jones@worshipstreet.com";

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={handleSheetChange}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ display: "none" }}
      backgroundStyle={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 28,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Bar */}
        <View className="flex-row items-center justify-between mb-10">
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            activeOpacity={0.7}
            style={styles.headerIconButton}
          >
            <CloseIcon width={15} height={15} />
          </TouchableOpacity>

          {/* Domain name */}
          <Text className="font-dm-semibold text-base text-black">
            accounts.zeroque.com
          </Text>

          {/* Collapse Icon */}
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              sheetRef.current?.collapse?.();
            }}
            activeOpacity={0.7}
            style={styles.headerIconButton}
          >
            <CollapseIcon width={25} height={25} />
          </TouchableOpacity>
        </View>

        {/* ── STEP 1: EMAIL SIGN IN ── */}
        {step === "email" && (
          <View style={{ flex: 1 }}>
            <View className="items-center mb-7">
              <AppIcon width={48} height={48} />
            </View>

            {/* Title */}
            <Text className="text-2xl text-center font-dm-bold text-black mb-6">
              Sign in to ZeroQue
            </Text>

            {/* Email input */}
            <View className="mb-4">
              <FloatingTextInput
                label="Email address"
                required
                value={email}
                error={emailError}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Continue button */}
            <AppButton
              variant="solid"
              size="lg"
              label="Continue"
              fullWidth
              onPress={handleEmailContinue}
            />

            {/* Legal */}
            <Text className="font-dm-regular text-sm text-black/70 text-center mt-4 ">
              By proceeding to use ZeroQue, you agree to our{" "}
              <Text className="text-black/70 font-dm-regular underline decoration-black/70">
                terms of service
              </Text>
              {"\n"}and{" "}
              <Text className="text-black/70 font-dm-regular underline decoration-black/70">
                privacy policy
              </Text>
            </Text>
          </View>
        )}

        {/* ── STEP 2: VERIFY OTP ── */}
        {step === "otp" && (
          <View style={{ flex: 1 }}>
            {/* Logo mark */}
            <View className="items-center mb-4">
              <AppIcon width={48} height={48} />
            </View>

            {/* Title */}
            <Text className="font-dm-bold text-2xl text-black text-center mb-2">
              Verify your email
            </Text>

            {/* Subtitle with email */}
            <View style={{ marginBottom: 16, alignItems: "center" }}>
              <Text className="font-dm-regular text-sm text-black/70 text-center">
                Enter code sent to
              </Text>
              <Text className="font-dm-semibold text-sm text-black text-center mt-1">
                {displayEmail}
              </Text>
            </View>

            {/* OTP Entry */}
            <View style={{ marginBottom: 16, width: "100%" }}>
              <OtpInput
                numberOfDigits={6}
                focusColor={colors.primary}
                autoFocus={false}
                onTextChange={setOtp}
                type="numeric"
                textInputProps={{
                  keyboardType: "number-pad",
                }}
                theme={{
                  containerStyle: {
                    justifyContent: "space-between",
                    width: "100%",
                  },
                  pinCodeContainerStyle: {
                    width: 50,
                    height: 56,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.white,
                  },
                  focusedPinCodeContainerStyle: {
                    borderColor: colors.primary,
                    borderWidth: 1.5,
                  },
                  pinCodeTextStyle: {
                    fontFamily: "DMSans_600SemiBold",
                    fontSize: 20,
                    color: "#18181B",
                  },
                }}
              />
            </View>

            {/* Continue button */}
            <AppButton
              variant="solid"
              size="lg"
              label="Continue"
              fullWidth
              onPress={handleVerifyOtp}
            />

            {/* Change email address link */}
            <TouchableOpacity
              onPress={() => setStep("email")}
              activeOpacity={0.7}
              style={{ marginTop: 16, alignItems: "center" }}
            >
              <Text className="font-dm-medium text-black text-sm">
                Change email address
              </Text>
            </TouchableOpacity>

            {/* Bottom-left back button */}
            <View style={{ marginTop: "auto", paddingTop: 36 }}>
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                style={styles.headerIconButton}
              >
                <BackIcon width={9} height={17} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── STEP 3: WELCOME TO ZEROQUE (PASSWORD SETUP) ── */}
        {step === "setPassword" && (
          <View style={{ flex: 1 }}>
            {/* Logo mark */}
            <View className="items-center mb-4">
              <AppIcon width={44} height={46} />
            </View>

            {/* Title */}
            <Text className="font-dm-bold text-2xl text-black text-center mb-1">
              Welcome to ZeroQue!
            </Text>

            {/* Subtitle */}
            <Text className="font-dm-regular text-sm text-black/70 text-center mb-8">
              Setup you account to join Northwind{"\n"}Distribution as a
              Requester
            </Text>

            {/* Email (Disabled / Read-only) */}
            <View className="mb-4">
              <FloatingTextInput
                label="Email address"
                value={displayEmail}
                editable={false}
              />
            </View>

            {/* Full Name (Disabled / Read-only) */}
            <View className="mb-4">
              <FloatingTextInput
                label="Full name"
                value={fullName}
                editable={false}
              />
            </View>

            {/* Create Password */}
            <View className="mb-4">
              <PasswordTextInput
                placeholder="Create Password"
                value={createPassword}
                onChangeText={setCreatePassword}
              />
            </View>

            {/* Confirm Password */}
            <View className="mb-4">
              <PasswordTextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* Continue button */}
            <AppButton
              variant="solid"
              size="lg"
              label="Continue"
              fullWidth
              onPress={handlePasswordContinue}
            />

            {/* Legal */}
            <Text className="font-dm-regular text-xs text-black/70 text-center mt-4">
              By proceeding to use ZeroQue, you agree to our{" "}
              <Text className="underline text-xs text-black/70 font-dm-regular">
                terms of service
              </Text>
              {"\n"}and{" "}
              <Text className="underline text-xs text-black/70 font-dm-regular">
                privacy policy
              </Text>
            </Text>

            {/* Bottom Actions Bar */}
            <View className="flex-row items-center justify-between mt-auto">
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                style={styles.headerIconButton}
              >
                <BackIcon width={9} height={17} />
              </TouchableOpacity>

              <View style={styles.bottomActionPill}>
                <TouchableOpacity activeOpacity={0.7}>
                  <ExportIcon width={16} height={18} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}>
                  <RefreshIcon width={16} height={16} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ── STEP 4: SIGNING YOU IN... ── */}
        {step === "signingIn" && (
          <View style={{ flex: 1 }}>
            <View className="items-center mt-4">
              <View className="w-12 h-12 rounded-full bg-black items-center justify-center mb-4">
                <Text className="font-DMSans_600SemiBold text-lg text-white">
                  {displayEmail ? displayEmail.charAt(0).toLowerCase() : "s"}
                </Text>
              </View>

              {/* Title */}
              <Text className="font-dm-bold text-2xl text-black text-center mb-1">
                Signing you in...
              </Text>

              <Text className="font-dm-regular text-sm text-black/70 text-center ">
                {displayEmail}
              </Text>
            </View>

            {/* Bottom Actions Bar (anchored at bottom) */}
            <View className="flex-row items-center justify-between mt-auto">
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                style={styles.headerIconButton}
              >
                <BackIcon width={9} height={17} />
              </TouchableOpacity>

              <View style={styles.bottomActionPill}>
                <TouchableOpacity activeOpacity={0.7}>
                  <ExportIcon width={16} height={18} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}>
                  <RefreshIcon width={16} height={16} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ── STEP 5: EXPIRED INVITE ── */}
        {step === "expiredInvite" && (
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 8,
                paddingVertical: 32,
              }}
            >
              {/* Unlink / Broken Link Icon */}
              <View style={{ marginBottom: 16 }}>
                <UnlinkIcon width={48} height={48} />
              </View>

              {/* Title */}
              <Text className="font-dm-bold text-2xl text-black text-center mb-1">
                This invite has expired
              </Text>

              {/* Subtitle */}
              <Text className="font-dm-regular text-sm text-black/70 text-center mb-4">
                Ask admin for a new one, or try signing in if you&apos;ve
                already set up your account.
              </Text>

              {/* Continue button */}
              <View style={{ width: "100%" }}>
                <AppButton
                  variant="solid"
                  size="lg"
                  label="Continue"
                  fullWidth
                  onPress={handleExpiredContinue}
                />
              </View>
            </View>

            {/* Bottom Actions Bar */}
            <View className="flex-row items-center justify-between mt-auto">
              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                style={styles.headerIconButton}
              >
                <BackIcon width={9} height={17} />
              </TouchableOpacity>

              <View style={styles.bottomActionPill}>
                <TouchableOpacity activeOpacity={0.7}>
                  <ExportIcon width={16} height={18} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}>
                  <RefreshIcon width={16} height={16} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const buttonShadow = {
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.09,
  shadowRadius: 2,
  elevation: 2,
  boxShadow: [
    {
      offsetX: 0,
      offsetY: 4,
      blurRadius: 48,
      spreadDistance: 0,
      color: colors.shadowDrop,
    },
    {
      offsetX: 0,
      offsetY: 40,
      blurRadius: 30,
      spreadDistance: -40,
      color: colors.shadowInnerLight,
      inset: true,
    },
    {
      offsetX: 0,
      offsetY: -40,
      blurRadius: 10,
      spreadDistance: -50,
      color: colors.shadowInnerDark,
      inset: true,
    },
    {
      offsetX: 0,
      offsetY: 40,
      blurRadius: 10,
      spreadDistance: -50,
      color: colors.shadowInnerDark,
      inset: true,
    },
  ],
};

const styles = StyleSheet.create({
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...buttonShadow,
  },
  bottomActionPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 22,
    height: 44,
    paddingHorizontal: 16,
    gap: 24,
    ...buttonShadow,
  },
});
