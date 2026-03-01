import React, { FC } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import styles from './styles';

interface LyricsLineProps {
  text: string;
  isHighlighted?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
  index: number;
  currentActiveIndex:number;
  scrollY:SharedValue<number>;
  itemPositions:SharedValue<Record<number, number>>;
  itemHeights:SharedValue<Record<number, number>>;
}

const LyricsLine:FC<LyricsLineProps> = ({ text, isHighlighted, index, currentActiveIndex }) => {
  const isActive = index === currentActiveIndex;
  const animatedStyle = useAnimatedStyle(()=>{
      return {
        transform: [
          {
            scale: isActive ? withSpring(1.04, {
              damping:16,
              stiffness:160,
              mass:1
            
            }) : 1
          }
        ]
      }
  },[isActive]);
  return (
    <Animated.View style={[styles.container,animatedStyle]} >
      <Animated.Text style={[styles.text, { color: isHighlighted ? '#FFD700' : '#fff' }]}>{text}</Animated.Text>
    </Animated.View>
  )
}

export default LyricsLine