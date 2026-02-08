import React, { FC } from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import styles from './styles';

interface LyricsLineProps {
  text: string;
  isHighlighted?: boolean;
}
const LyricsLine:FC<LyricsLineProps> = ({ text, isHighlighted }) => {
  return (
    <Animated.View style={styles.container} >
      <Text style={[styles.text, { color: isHighlighted ? '#FFD700' : '#fff' }]}>{text}</Text>
    </Animated.View>
  )
}

export default LyricsLine