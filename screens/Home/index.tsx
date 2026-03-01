import { LyricsLine } from '@/components';
import { useAudioPlayer } from 'expo-audio';
import { Image } from 'expo-image';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Button, LayoutChangeEvent, ListRenderItemInfo, View } from 'react-native';
import Animated, { LinearTransition, useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LYRICS = [
  { start: 6690, text: "Heaven sent you to me" },
  { start: 11710, text: "I'm just hoping I don't repeat history" },
  { start: 19200, text: "Boy, I'm tryna meet your mama" },
  { start: 21400, text: "On a Sunday" },
  { start: 23240, text: "Then make a lotta love" },
  { start: 24690, text: "On a Monday" },
  { start: 26770, text: "Never need no" },
  { start: 28000, text: "No one else, babe" },
  { start: 29500, text: "'Cause I'll be" },
  { start: 31710, text: "Switching them positions for you" },
  { start: 34250, text: "Cooking in the kitchen and I'm in the bedroom" },
  { start: 37560, text: "I'm in the Olympics way I'm jumping through hoops" },
  { start: 40870, text: "Know my love infinite, nothing I wouldn't do" },
  { start: 44360, text: "That I won't do, switching for" },
  { start: 46830, text: "Perfect, perfect" },
  { start: 48800, text: "You're too good to be true (You're too good to be true)" },
  { start: 52440, text: "But I get tired of running" },
  { start: 54680, text: "Fuck it now I'm running with you (With you)" },
  { start: 59010, text: "Said, boy, I'm tryna meet your mama" },
  { start: 61320, text: "On a Sunday" },
  { start: 63250, text: "Then make a lotta love" },
  { start: 64660, text: "On a Monday" },
  { start: 66770, text: "Never need no" },
  { start: 68090, text: "No one else, babe" },
  { start: 69520, text: "'Cause I'll be" },
  { start: 71720, text: "Switching them positions for you" },
  { start: 74360, text: "Cooking in the kitchen and I'm in the bedroom" },
  { start: 77700, text: "I'm in the Olympics way I'm jumping through hoops" },
  { start: 80980, text: "Know my love infinite, nothing I wouldn't do" },
  { start: 84340, text: "That I won't do, switching for you" },
  { start: 87660, text: "Cooking in the kitchen and I'm in the bedroom" },
  { start: 90960, text: "I'm in the Olympics way I'm jumping through hoops" },
  { start: 94210, text: "Know my love infinite, nothing I wouldn't do" },
  { start: 97640, text: "That I won't do, switching for you" },
  { start: 100460, text: "This some shit that I" },
  { start: 102220, text: "Usually don't do" },
  { start: 103840, text: "But for you, I kinda" },
  { start: 105500, text: "Kinda want to" },
  { start: 107200, text: "'Cause you're down for me" },
  { start: 108910, text: "And I'm down too" },
  { start: 111720, text: "Switching them positions for you" },
  { start: 113940, text: "This some shit that I (Yeah)" },
  { start: 115520, text: "Usually don't do (Don't do)" },
  { start: 117250, text: "But for you, I kinda" },
  { start: 118920, text: "Kinda want to" },
  { start: 120500, text: "'Cause you're down for me" },
  { start: 122210, text: "And I'm down too" },
  { start: 125150, text: "Switching them positions for you" },
  { start: 127730, text: "Cooking in the kitchen and I'm in the bedroom" },
  { start: 131060, text: "I'm in the Olympics way I'm jumping through hoops" },
  { start: 134250, text: "Know my love infinite, nothing I wouldn't do" },
  { start: 137540, text: "That I won't do, switching for you" },
  { start: 140870, text: "Cooking in the kitchen and I'm in the bedroom" },
  { start: 144230, text: "I'm in the Olympics way I'm jumping through hoops" },
  { start: 147550, text: "Know my love infinite, nothing I wouldn't do" },
  { start: 150980, text: "That I won't do, switching for you" }
];

const Home: FC = () => {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useAnimatedRef<Animated.FlatList>();
  const itemPositions = useSharedValue({});
  const itemHeights = useSharedValue({});
  const ScrollY = useSharedValue(0);

  const source = require('../../assets/audio/positions.mp3')
   const player = useAudioPlayer(source);

  // listen to playback time and update highlighted lyric
  // useEffect(() => {
  //   const callback = (e: any) => {
  //     // expo-audio returns time in seconds
  //     const timeMs = e.currentTime * 1000;
  //     // find lyric index for current playback time
  //     setActiveIndex((prev) => {
  //       const newIndex = LYRICS.findIndex(
  //         (l) => timeMs >= l.start && timeMs < l.end
  //       );
  //       if (newIndex !== -1 && newIndex !== prev) {
  //         flatListRef.current?.scrollToIndex({
  //           index: newIndex,
  //           animated: true,
  //           viewPosition: 0.5,
  //         });
  //         return newIndex;
  //       }
  //       return prev;
  //     });
  //   };

  //   player.addListener('playbackStatusUpdate', callback);
  //   return () => {
  //     player.removeAllListeners('playbackStatusUpdate');
  //   };
  // }, []);

  const currentIndexRef = useRef(0);

useEffect(() => {
  const callback = (e: any) => {
    const timeMs = e.currentTime * 1000;
    const currentIndex = currentIndexRef.current;

    if (
      currentIndex < LYRICS.length - 1 &&
      timeMs >= LYRICS[currentIndex + 1].start
    ) {
      const newIndex = currentIndex + 1;
      currentIndexRef.current = newIndex;
      setActiveIndex(newIndex);

      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
        viewPosition: 0.2,
      });
    }
  };

  const subscription = player.addListener(
    "playbackStatusUpdate",
    callback
  );

  return () => subscription.remove();
}, []);

  // Animated Scroll Handler
  const scrollHandler = useAnimatedScrollHandler((event) => {
      // console.log(event.contentOffset.y);
      ScrollY.value = event.contentOffset.y;
  });

  const handlePlayPause = () => {
    if(player.paused) {
      player.play()
    } else {
      player.pause();
    }
  }

  // Handle Item Layout
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

  // List Render Item
  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<typeof LYRICS[number]>) => {
    return (
        <LyricsLine text={item.text} isHighlighted={index === activeIndex}
          itemHeights={itemHeights}
          itemPositions={itemPositions}
          index={index}
          scrollY={ScrollY}
          onLayout={(event) => handleItemLayout(index, event)}
          currentActiveIndex={activeIndex}
        />
    )
  }, [activeIndex,setActiveIndex]);
  

  return (
    <View style={{ flex: 1,  }} >
      <View style={{ paddingTop: insets.top, flex: 1 }}>
        <Animated.FlatList
          ref={flatListRef}
          style={{ flex: 1 }}
          onScroll={scrollHandler}
          data={LYRICS}
          keyExtractor={(item) => item.start.toString()}
          renderItem={renderItem}
          layout={LinearTransition.springify()}
          contentContainerStyle={{ gap: 10, paddingBottom: insets.bottom + 20, paddingHorizontal: 20, paddingTop:90 }}
          onScrollBeginDrag={() => {
    console.log("User started dragging");
  }}
  onScrollEndDrag={() => {
    console.log("User released finger");
  }}
  onMomentumScrollBegin={() => {
    console.log("Momentum started");
  }}
  onMomentumScrollEnd={() => {
    console.log("Scroll fully stopped");
  }}
        />
        {/* playback toggle only; scrolling now driven by audio time */}
        <View style={{ alignItems: 'center', padding: 20 }}>
          <Button title={!player.paused ? 'Pause' : 'Play'} onPress={handlePlayPause} color="white" />
        </View>
      </View>
      <Image
        source={require('../../assets/images/bg_image.webp')}
        style={{
          position:'absolute',
          top:0,
          bottom:0,
          left:0,
          right:0,
          zIndex:-1
        }}
        blurRadius={60}
      />
    </View>
  )
}

export default Home