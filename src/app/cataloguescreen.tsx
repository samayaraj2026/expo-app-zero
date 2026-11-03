import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/ui";
import {
  CARD_CLASS,
  CATALOGUE_COLUMNS,
  CATALOGUE_IMAGE_SETS,
} from "@/constants";

const styles = StyleSheet.create({
  fullImage: {
    width: "100%",
    height: "100%",
  },
  skipHitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
});

interface CatalogueCardProps {
  cardIndex: number;
  activeSetIndex: number;
}

const CatalogueCard = memo(function CatalogueCard({
  cardIndex,
  activeSetIndex,
}: CatalogueCardProps) {
  const [layerAUri, setLayerAUri] = useState(
    CATALOGUE_IMAGE_SETS[0][cardIndex],
  );
  const [layerBUri, setLayerBUri] = useState(
    CATALOGUE_IMAGE_SETS[1 % CATALOGUE_IMAGE_SETS.length][cardIndex],
  );
  const [topLayer, setTopLayer] = useState<"A" | "B">("A");

  const isFirstMount = useRef(true);
  const activeLayerRef = useRef<"A" | "B">("A");

  const [animA] = useState(() => new Animated.Value(0));
  const [animB] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      const introAnimation = Animated.timing(animA, {
        toValue: 1,
        duration: 350,
        delay: cardIndex * 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
      introAnimation.start();
      return () => introAnimation.stop();
    }

    const nextUri = CATALOGUE_IMAGE_SETS[activeSetIndex][cardIndex];

    if (activeLayerRef.current === "A") {
      activeLayerRef.current = "B";
      setLayerBUri(nextUri);
      setTopLayer("B");
      animB.setValue(0);

      const animation = Animated.timing(animB, {
        toValue: 1,
        duration: 350,
        delay: cardIndex * 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

      animation.start(({ finished }) => {
        if (finished) {
          animA.setValue(0);
        }
      });

      return () => animation.stop();
    } else {
      activeLayerRef.current = "A";
      setLayerAUri(nextUri);
      setTopLayer("A");
      animA.setValue(0);

      const animation = Animated.timing(animA, {
        toValue: 1,
        duration: 350,
        delay: cardIndex * 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

      animation.start(({ finished }) => {
        if (finished) {
          animB.setValue(0);
        }
      });

      return () => animation.stop();
    }
  }, [activeSetIndex, cardIndex, animA, animB]);

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
          style={styles.fullImage}
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
          style={styles.fullImage}
          contentFit="cover"
          transition={0}
          cachePolicy="memory-disk"
        />
      </Animated.View>
    </View>
  );
});

interface CatalogueColumnProps {
  marginTop: number;
  startIndex: number;
  count: number;
  activeSetIndex: number;
}

const CatalogueColumn = memo(function CatalogueColumn({
  marginTop,
  startIndex,
  count,
  activeSetIndex,
}: CatalogueColumnProps) {
  return (
    <View className="items-center gap-3" style={{ marginTop }}>
      {Array.from({ length: count }, (_, itemIndex) => {
        const globalIndex = startIndex + itemIndex;
        return (
          <CatalogueCard
            key={globalIndex}
            cardIndex={globalIndex}
            activeSetIndex={activeSetIndex}
          />
        );
      })}
    </View>
  );
});

export default function CatalogueIntroScreen() {
  const insets = useSafeAreaInsets();
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  useEffect(() => {
    // Pre-cache all images on mount for instantaneous rendering
    CATALOGUE_IMAGE_SETS.forEach((imageSet) => {
      imageSet.forEach((imageUrl) => {
        Image.prefetch(imageUrl);
      });
    });

    const intervalTimer = setInterval(() => {
      setActiveSetIndex((previousSet) => (previousSet + 1) % CATALOGUE_IMAGE_SETS.length);
    }, 4200);

    return () => clearInterval(intervalTimer);
  }, []);

  const handleSkip = useCallback(() => {
    router.replace("/(tabs)/home");
  }, []);

  const handleNext = useCallback(() => {
    router.push("/requestscreen");
  }, []);

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
          hitSlop={styles.skipHitSlop}
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
            activeSetIndex={activeSetIndex}
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
