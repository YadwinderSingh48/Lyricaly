import { LyricsLine } from '@/components';
import React, { FC, useCallback, useState } from 'react';
import { Button, LayoutChangeEvent, ListRenderItemInfo, View } from 'react-native';
import Animated, { Easing, LinearTransition, useAnimatedRef, useAnimatedScrollHandler, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LYRICS = [
  { start: 0, end: 2500, text: "In the quiet of the night" },
  { start: 2500, end: 5000, text: "City lights are glowing bright" },
  { start: 5000, end: 7500, text: "Footsteps echo down the street" },
  { start: 7500, end: 10000, text: "Rhythm in a steady beat" },

  { start: 10000, end: 12500, text: "Neon signs and passing cars" },
  { start: 12500, end: 15000, text: "Dreams are drifting past the bars" },
  { start: 15000, end: 17500, text: "Every shadow tells a tale" },
  { start: 17500, end: 20000, text: "Every whisper leaves a trail" },

  { start: 20000, end: 22500, text: "Hearts are racing in the dark" },
  { start: 22500, end: 25000, text: "Chasing one electric spark" },
  { start: 25000, end: 27500, text: "Moments fading, passing by" },
  { start: 27500, end: 30000, text: "Like a comet in the sky" },

  { start: 30000, end: 32500, text: "Hold the feeling, don’t let go" },
  { start: 32500, end: 35000, text: "Let the midnight current flow" },
  { start: 35000, end: 37500, text: "Every note and every rhyme" },
  { start: 37500, end: 40000, text: "Dancing softly out of time" }
];

const Home: FC = () => {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useAnimatedRef<Animated.FlatList>();
  const itemPositions = useSharedValue({});
  const itemHeights = useSharedValue({});



  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<typeof LYRICS[number]>) => {
    return (
        <LyricsLine text={item.text} isHighlighted={index === activeIndex} />
    )
  }, [activeIndex])

  const updateActiveIndex = useCallback((type: 'next' | 'prev') => {
    let currentIndex = activeIndex;
    setActiveIndex((prevIndex) => {
      const newIndex = type === 'next' ? prevIndex + 1 : prevIndex - 1;
      const updatedIndex = newIndex >= LYRICS.length ? 0 : newIndex < 0 ? LYRICS.length - 1 : newIndex;
      currentIndex = updatedIndex;
      return updatedIndex;
    });
    flatListRef.current?.scrollToIndex({ index: currentIndex, animated: true });
  }, []);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    progress.value = withTiming(1,{duration:50,easing:Easing.inOut(Easing.ease)},(finished)=>{
    if (finished) progress.value = withTiming(0,{duration:50,easing:Easing.inOut(Easing.ease)});
    });
    // console.log("scrollY",event.contentOffset.y);  
  });

    const handleItemLayout = useCallback((index:number, event:LayoutChangeEvent) => {
    const { height, y } = event.nativeEvent.layout;
    itemHeights.value = {
      ...itemHeights.value,
      [index]: height,
    };
    itemPositions.value = {
      ...itemPositions.value,
      [index]: y,
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#427A43' }} >
      <View style={{ paddingTop: insets.top, flex: 1 }}>
        <Animated.FlatList
          ref={flatListRef}
          style={{ flex: 1 }}
          onScroll={scrollHandler}
          data={LYRICS}
          keyExtractor={(item) => item.text}
          renderItem={renderItem}
          layout={LinearTransition.springify()}
          contentContainerStyle={{ gap: 10, paddingBottom: insets.bottom + 20, paddingHorizontal: 20 }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20, height: 100 }}>
          <Button title="Move Previous" color={'white'} onPress={() => updateActiveIndex('prev')} />
          <Button title="Move Next" color={'white'} onPress={() => updateActiveIndex('next')} />
        </View>
      </View>

    </View>
  )
}

export default Home