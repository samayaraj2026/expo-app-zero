import { useEffect, useRef, useState } from "react";
import AppButton from "@/components/ui/AppButton";
import {
  CARD_CLASS,
  CATALOGUE_COLUMNS,
  CATALOGUE_IMAGE_SETS,
} from "@/constants";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CatalogueCard({
  index,
  setIndex,
}: {
  index: number;
  setIndex: number;
}) {
  const [layerAUri, setLayerAUri] = useState(CATALOGUE_IMAGE_SETS[0][index]);
  const [layerBUri, setLayerBUri] = useState(
    CATALOGUE_IMAGE_SETS[1 % CATALOGUE_IMAGE_SETS.length][index]
  );
  const [topLayer, setTopLayer] = useState<"A" | "B">("A");

  const isFirstMount = useRef(true);
  const activeLayerRef = useRef<"A" | "B">("A");

  const [animA] = useState(() => new Animated.Value(0));
  const [animB] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      // Staggered intro animation for initial set (Set 1)
      const anim = Animated.timing(animA, {
        toValue: 1,
        duration: 350,
        delay: index * 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
      anim.start();
      return () => anim.stop();
    }

    const nextUri = CATALOGUE_IMAGE_SETS[setIndex][index];

    if (activeLayerRef.current === "A") {
      activeLayerRef.current = "B";
      setLayerBUri(nextUri);
      setTopLayer("B");
      animB.setValue(0);

      const anim = Animated.timing(animB, {
        toValue: 1,
        duration: 350,
        delay: index * 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

      anim.start(({ finished }) => {
        if (finished) {
          animA.setValue(0);
        }
      });

      return () => anim.stop();
    } else {
      activeLayerRef.current = "A";
      setLayerAUri(nextUri);
      setTopLayer("A");
      animA.setValue(0);

      const anim = Animated.timing(animA, {
        toValue: 1,
        duration: 350,
        delay: index * 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

      anim.start(({ finished }) => {
        if (finished) {
          animB.setValue(0);
        }
      });

      return () => anim.stop();
    }
  }, [setIndex, index, animA, animB]);

  const scaleA = animA.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  const scaleB = animB.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  return (
    <View className={CARD_CLASS}>
      {/* Layer A */}
      <Animated.View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: animA,
          transform: [{ scale: scaleA }],
          zIndex: topLayer === "A" ? 2 : 1,
          elevation: topLayer === "A" ? 2 : 1,
        }}
      >
        <Image
          source={{ uri: layerAUri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={0}
          cachePolicy="memory-disk"
        />
      </Animated.View>

      {/* Layer B */}
      <Animated.View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: animB,
          transform: [{ scale: scaleB }],
          zIndex: topLayer === "B" ? 2 : 1,
          elevation: topLayer === "B" ? 2 : 1,
        }}
      >
        <Image
          source={{ uri: layerBUri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={0}
          cachePolicy="memory-disk"
        />
      </Animated.View>
    </View>
  );
}

function CatalogueColumn({
  marginTop,
  startIndex,
  count,
  setIndex,
}: {
  marginTop: number;
  startIndex: number;
  count: number;
  setIndex: number;
}) {
  return (
    <View className="items-center gap-3" style={{ marginTop }}>
      {Array.from({ length: count }, (_, i) => {
        const globalIndex = startIndex + i;
        return (
          <CatalogueCard
            key={globalIndex}
            index={globalIndex}
            setIndex={setIndex}
          />
        );
      })}
    </View>
  );
}

export default function CatalogueIntroScreen() {
  const insets = useSafeAreaInsets();
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  useEffect(() => {
    // Pre-cache all images on mount for instantaneous, flicker-free rendering
    CATALOGUE_IMAGE_SETS.forEach((set) => {
      set.forEach((url) => {
        Image.prefetch(url);
      });
    });

    // 11 cards * 160ms = 1600ms stagger + 350ms duration = 1950ms animation + 2250ms hold = 4200ms per cycle
    const interval = setInterval(() => {
      setActiveSetIndex((prev) => (prev + 1) % CATALOGUE_IMAGE_SETS.length);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    router.replace("/(tabs)/home");
  };

  const handleNext = () => {
    router.push("/requestscreen");
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom, 16),
      }}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row justify-end px-6 pt-2">
        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.7}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
        >
          <Text className="font-dm-medium text-base text-black">Skip</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-14 items-center px-6">
        <Text className="mb-2 text-center font-dm-bold text-4xl text-black">
          Everything you can buy, in one catalogue
        </Text>

        <Text className="text-center font-dm-regular text-base text-black/70">
          Browse approved products, add what you need, and submit, no spreadsheets, no guesswork.
        </Text>
      </View>

      {/* Masonry Grid with One-by-One Seamless Crossfade Loop */}
      <View className="flex-1 flex-row justify-center items-start gap-3 overflow-hidden pt-6">
        {CATALOGUE_COLUMNS.map((column) => (
          <CatalogueColumn
            key={column.id}
            marginTop={column.marginTop}
            startIndex={column.startIndex}
            count={column.count}
            setIndex={activeSetIndex}
          />
        ))}
      </View>

      <View className="w-full px-6 pb-3">
        <AppButton
          variant="solid"
          size="lg"
          label="Next"
          fullWidth
          onPress={handleNext}
        />
      </View>
    </View>
  );
}
