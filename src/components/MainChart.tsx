import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Circle, G, Svg } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type propsType = {
  percentages: number[],
  colors: string[],
}

export default function MainChart({ percentages, colors }: propsType): React.JSX.Element {
  const radius = 130;
  const strokeWidth = 90;
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;

  const circleRefs = percentages.map(() => useRef<Circle>(null));
  const animatedValues = percentages.map((_, index) => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    percentages.forEach((percentage, index) => {
      const animation = Animated.timing(animatedValues[index], {
        toValue: percentage,
        duration: 1000,
        useNativeDriver: true
      })
      animation.start();
    })


    return () => {
      animatedValues.forEach((value) => {
        value.removeAllListeners();
      })
    }
  }, [percentages])


  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`} style={{ alignSelf: "center" }}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          {percentages.map((_, index) => (
            <AnimatedCircle
              key={index}
              ref={circleRefs[index]}
              cx="50%"
              cy="50%"
              stroke={colors[index]}
              strokeWidth={strokeWidth}
              r={radius}
              fill="transparent"
              strokeDasharray={circleCircumference}
              strokeDashoffset={animatedValues[index].interpolate({
                inputRange: [0, 100],
                outputRange: [circleCircumference, 0],
              })}
            />
          ))}
        </G>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20
  }
})