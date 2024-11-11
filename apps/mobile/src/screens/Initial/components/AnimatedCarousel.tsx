import React, { useRef, useState } from 'react';
import { View, Text, useWindowDimensions, FlatList, Animated, ViewToken } from 'react-native';

import { Svg, IconName } from '../../../components/primitives/Svg';

const OnboardingSlides: { title: string; type: IconName; description: string }[] = [
  {
    title: 'Welcome to RestRoute',
    type: 'map',
    description: 'Restrooms anywhere, anytime, everywhere',
  },
  {
    title: 'Rate & Review',
    type: 'stars',
    description: 'Share your experience',
  },
  {
    title: 'Know Before You Go',
    type: 'restroom',
    description: 'Get crucial details',
  },
  {
    title: 'Your Feedback Matters',
    type: 'feedback',
    description: 'Leave helpful reviews',
  },
];

type OnboardingSlideType = (typeof OnboardingSlides)[number];

export default function AnimatedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { width } = useWindowDimensions();

  const scrollHorizontal = useRef(new Animated.Value(0)).current;
  const flashListRef = useRef<FlatList<OnboardingSlideType>>(null);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const ITEM_WIDTH = width * 0.9;

  const renderItem = ({ item }: { item: OnboardingSlideType }) => (
    <View className="w-[90vw] flex justify-center self-center">
      <Svg size={350} name={item.type} />
    </View>
  );

  const onItemsChange = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<OnboardingSlideType>[] }) => {
      const currentIndex = viewableItems[0]?.index ?? 0; // Get the index from the first viewable item
      setCurrentIndex(currentIndex);
    }
  ).current;

  return (
    <View className="items-center">
      <FlatList
        data={OnboardingSlides}
        renderItem={renderItem}
        onViewableItemsChanged={onItemsChange}
        horizontal
        ref={flashListRef}
        viewabilityConfig={viewConfigRef}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{ paddingHorizontal: (width - ITEM_WIDTH) / 2 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollHorizontal } } }], {
          useNativeDriver: false,
        })}
      />

      <View className="flex-row mb-20  gap-x-5">
        {OnboardingSlides.map((slide, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

          const dotWidth = scrollHorizontal.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={slide.title}
              style={{
                width: dotWidth,
              }}
              className={`h-3 rounded-full ${
                index === currentIndex ? 'bg-gray-950' : 'bg-gray-500'
              }`}
            />
          );
        })}
      </View>

      <Animated.View
        className="gap-y-3 items-center"
        style={{
          opacity: scrollHorizontal.interpolate({
            inputRange: [
              (currentIndex - 1) * ITEM_WIDTH - 1, // Start fading in earlier
              currentIndex * ITEM_WIDTH,
              (currentIndex + 1) * ITEM_WIDTH + 1, // Start fading out later
            ],
            outputRange: [0, 1, 0],
            extrapolate: 'clamp', // Keeps the opacity within the range
          }),
        }}
      >
        <Text className="text-4xl font-semibold">{OnboardingSlides.at(currentIndex)?.title}</Text>
        <Text className="text-lg font-medium">
          {OnboardingSlides.at(currentIndex)?.description}
        </Text>
      </Animated.View>
    </View>
  );
}
