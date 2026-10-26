import React from "react";
import { ScrollView, Text, View } from "react-native";
import AppButton from "./ui/AppButton";

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-8">
      <Text className="text-xs font-dm-semibold text-gray uppercase tracking-widest mb-3">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function ButtonShowcase() {
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="px-5 pt-14 pb-10"
    >
      <Text className="text-2xl font-dm-bold text-primary mb-1">
        Button System
      </Text>
      <Text className="text-sm font-dm-regular text-gray mb-8">
        All variants · sizes · states
      </Text>

      {/* ── SOLID ── */}
      <Section title="Solid">
        <View className="gap-3">
          <AppButton
            variant="solid"
            size="lg"
            label="Large — Add to cart"
            onPress={() => {}}
            fullWidth
          />
          <AppButton
            variant="solid"
            size="md"
            label="Medium — Checkout"
            onPress={() => {}}
            fullWidth
          />
          <AppButton
            variant="solid"
            size="sm"
            label="Small — Confirm"
            onPress={() => {}}
            fullWidth
          />
        </View>
      </Section>

      {/* ── OUTLINE ── */}
      <Section title="Outline">
        <View className="gap-3">
          <AppButton
            variant="secondary"
            size="lg"
            label="See all "
            onPress={() => {}}
            fullWidth
          />
          <AppButton
            variant="secondary"
            size="md"
            label="See all "
            onPress={() => {}}
            fullWidth
          />
          <AppButton
            variant="secondary"
            size="sm"
            label="See all "
            onPress={() => {}}
            fullWidth
          />
        </View>
      </Section>

      {/* ── GHOST / TEXT ── */}
      <Section title="Ghost (text)">
        <View className="flex-row justify-center items-center gap-2">
          <AppButton
            variant="ghost"
            size="lg"
            label="Change email address"
            onPress={() => {}}
          />
        </View>
      </Section>

      {/* ── ICON ── */}
      <Section title="Icon (Sort / Filter)">
        <View className="flex-row gap-3 flex-wrap">
          <AppButton
            variant="icon"
            size="md"
            label="Sort"
            icon={<Text className="text-black text-sm">⇅</Text>}
            onPress={() => {}}
          />
          <AppButton
            variant="icon"
            size="md"
            label="Filter"
            icon={<Text className="text-black text-sm">#</Text>}
            onPress={() => {}}
          />
        </View>
      </Section>

      {/* ── CATEGORY CHIPS ── */}
      <Section title="Category chips (outline sm)">
        <View className="flex-row gap-2 flex-wrap">
          {(
            [
              {
                label: "Stationery",
                image: require("../../assets/images/react-logo.png"),
              },
              {
                label: "Packaging",
                image: require("../../assets/images/expo-logo.png"),
              },
              {
                label: "Safety",
                image: require("../../assets/images/expo-badge.png"),
              },
              {
                label: "Cleaning",
                image: require("../../assets/images/expo-badge-white.png"),
              },
              {
                label: "IT",
                image: require("../../assets/images/react-logo.png"),
              },
            ] as const
          ).map((cat) => (
            <AppButton
              key={cat.label}
              variant="outline"
              size="sm"
              label={cat.label}
              image={cat.image}
              onPress={() => {}}
            />
          ))}
        </View>
      </Section>

      {/* ── STEPPER ── */}
      <Section title="Stepper (qty control)">
        <View className="flex-row gap-6 items-center flex-wrap">
          <View className="items-center gap-1">
            <AppButton
              variant="stepper"
              initialValue={0}
              min={0}
              max={10}
              onValueChange={(v) => console.log("qty (starts 0):", v)}
            />
            <Text className="text-xs text-gray font-dm-regular">
              Starts at 0 (+ only)
            </Text>
          </View>

          <View className="items-center gap-1">
            <AppButton
              variant="stepper"
              initialValue={1}
              min={0}
              max={10}
              onValueChange={(v) => console.log("qty (starts 1):", v)}
            />
            <Text className="text-xs text-gray font-dm-regular">
              Starts at 1 (− 1 +)
            </Text>
          </View>

          <View className="items-center gap-1">
            <AppButton variant="stepper" initialValue={3} min={1} max={5} />
            <Text className="text-xs text-gray font-dm-regular">
              Min 1, Max 5
            </Text>
          </View>
        </View>
      </Section>
    </ScrollView>
  );
}
