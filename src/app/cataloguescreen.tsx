import { useEffect, useMemo, useState } from "react";
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
  bottomImageUri,
  topImageUri,
  anim,
}: {
  bottomImageUri?: string;
  topImageUri: string;
  anim: Animated.Value;
}) {
  const opacity = anim;
  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  return (
    <View className={CARD_CLASS}>
      {/* Previous image layer: stays visible underneath so the gray container never flashes */}
      {bottomImageUri ? (
        <Image
          source={{ uri: bottomImageUri }}
          style={{ width: "100%", height: "100%", position: "absolute" }}
          contentFit="cover"
        />
      ) : null}

      {/* New incoming image layer: cross-fades and scales in over the previous image */}
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          opacity,
          transform: [{ scale }],
        }}
      >
        <Image
          source={{ uri: topImageUri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={150}
        />
      </Animated.View>
    </View>
  );
}

function CatalogueColumn({
  marginTop,
  startIndex,
  count,
  bottomImages,
  topImages,
  cardAnims,
}: {
  marginTop: number;
  startIndex: number;
  count: number;
  bottomImages?: string[];
  topImages: string[];
  cardAnims: Animated.Value[];
}) {
  return (
    <View
      className="items-center gap-3"
      style={{ marginTop }}
    >
      {Array.from({ length: count }, (_, i) => {
        const globalIndex = startIndex + i;
        const bottomImageUri = bottomImages
          ? bottomImages[globalIndex]
          : undefined;
        const topImageUri = topImages[globalIndex];
        const anim = cardAnims[globalIndex];

        return (
          <CatalogueCard
            key={globalIndex}
            bottomImageUri={bottomImageUri}
            topImageUri={topImageUri}
            anim={anim}
          />
        );
      })}
    </View>
  );
}

export default function CatalogueIntroScreen() {
  const insets = useSafeAreaInsets();

  // Dual-layer state: bottom layer preserves currently visible images, top layer cross-fades incoming images
  const [renderSets, setRenderSets] = useState<{
    bottom: number | null;
    top: number;
  }>({
    bottom: null,
    top: 0,
  });

  // 11 animated values for the top layer cross-fade
  const cardAnims = useMemo(
    () => Array.from({ length: 11 }, () => new Animated.Value(0)),
    []
  );

  useEffect(() => {
    let isMounted = true;
    let holdTimer: ReturnType<typeof setTimeout>;
    let nextCycleTimer: ReturnType<typeof setTimeout>;
    let currentTop = 0;

    const runTransition = () => {
      if (!isMounted) return;

      // 1. Reset top layer animated values to 0
      cardAnims.forEach((anim) => anim.setValue(0));

      // 2. Animate incoming images ONE BY ONE (160ms stagger) directly over the existing images
      const animations = cardAnims.map((anim, i) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 350,
          delay: i * 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      );

      Animated.parallel(animations).start(({ finished }) => {
        if (!finished || !isMounted) return;

        // 3. Hold all filled images for 2 seconds
        holdTimer = setTimeout(() => {
          if (!isMounted) return;

          const previousTop = currentTop;
          const nextTop = (currentTop + 1) % CATALOGUE_IMAGE_SETS.length;
          currentTop = nextTop;

          // 4. Seamless promotion: current top image becomes bottom background.
          // Resetting cardAnims to 0 causes zero visual flicker because the bottom layer has the identical image!
          cardAnims.forEach((anim) => anim.setValue(0));
          setRenderSets({ bottom: previousTop, top: nextTop });

          // 5. Brief tick to allow React to mount the new URIs, then run the next cross-fade cycle
          nextCycleTimer = setTimeout(() => {
            if (isMounted) {
              runTransition();
            }
          }, 60);
        }, 2000);
      });
    };

    runTransition();

    return () => {
      isMounted = false;
      clearTimeout(holdTimer);
      clearTimeout(nextCycleTimer);
      cardAnims.forEach((anim) => anim.stopAnimation());
    };
  }, [cardAnims]);

  const bottomImages =
    renderSets.bottom !== null
      ? CATALOGUE_IMAGE_SETS[renderSets.bottom]
      : undefined;
  const topImages = CATALOGUE_IMAGE_SETS[renderSets.top];

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
            bottomImages={bottomImages}
            topImages={topImages}
            cardAnims={cardAnims}
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
