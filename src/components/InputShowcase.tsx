import {
  FloatingTextInput,
  PasswordTextInput,
  SearchTextInput,
} from "@/components/ui";
import { useState } from "react";
import { Text, View } from "react-native";

export default function InputShowcase() {
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [interactiveEmail, setInteractiveEmail] = useState("");
  const [filledEmail, setFilledEmail] = useState("johndoe@zeroque.com");

  return (
    <View className="flex-1">
      <Text className="font-dm-bold text-2xl text-zinc-900 mb-1">
        Password Input
      </Text>
      <Text className="font-dm-regular text-sm text-zinc-500 mb-4">
        Eye visibility toggle with VisibleIcon from assets.
      </Text>

      <View className="mb-8">
        <PasswordTextInput
          placeholder="Create Password"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View className="h-px bg-zinc-200 mb-8" />

      <Text className="font-dm-bold text-xl text-zinc-900 mb-1">
        Search Input
      </Text>
      <Text className="font-dm-regular text-sm text-zinc-500 mb-4">
        Using SearchIcon and QueIcon directly from src/assets/index.ts.
      </Text>

      <View className="mb-8">
        <SearchTextInput
          placeholder="Search all product"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onPressRightIcon={() => console.log("Que AI action pressed")}
          showClearButton
        />
      </View>

      <View className="h-px bg-zinc-200 mb-8" />

      <Text className="font-dm-bold text-xl text-zinc-900 mb-1">
        Floating Input Component
      </Text>
      <Text className="font-dm-regular text-sm text-zinc-500 mb-6">
        Default, active/filled, and disabled states with smooth animated label.
      </Text>

      <View className="mb-6">
        <Text className="font-dm-medium text-xs text-zinc-400 mb-2 uppercase tracking-wider">
          1. Initial / Interactive (Empty State)
        </Text>
        <FloatingTextInput
          label="Email address"
          required
          value={interactiveEmail}
          onChangeText={setInteractiveEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mb-6">
        <Text className="font-dm-medium text-xs text-zinc-400 mb-2 uppercase tracking-wider">
          2. Filled / Active State
        </Text>
        <FloatingTextInput
          label="Full name"
          required
          value={filledEmail}
          onChangeText={setFilledEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mb-6">
        <Text className="font-dm-medium text-xs text-zinc-400 mb-2 uppercase tracking-wider">
          3. Disabled State
        </Text>
        <FloatingTextInput
          label="Email address"
          value="sarah.jones@worshipstreet.com"
          editable={false}
        />
      </View>
    </View>
  );
}
