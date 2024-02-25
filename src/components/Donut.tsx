import { StyleSheet, Animated, View, TextInput } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Svg, { G, Circle } from 'react-native-svg'

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

type propsType = {
  percentage: number,
  max: number,
  color: string
}

export default function Donut({ percentage, color, max }: propsType): React.JSX.Element {
  const radius = 50;
  const strokeWidth = 12;
  const delay = 500;
  const duration = 1000;

  const animatedValue = useRef(new Animated.Value(0)).current;

  const animation = (toValue: number) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      delay,
      useNativeDriver: true
    }).start();
  }

  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius

  const circleRef = useRef<Circle>(null)
  const inputRef = useRef<TextInput>(null)


  useEffect(() => {
    animation(percentage);

    const timeoutId = setTimeout(() => {
      animatedValue.addListener(v => {
        if (circleRef.current) {
          const maxPer = 100 * v.value / max;
          const strokeDashoffset =
            circleCircumference - (circleCircumference * maxPer) / 100
          circleRef.current.setNativeProps({
            strokeDashoffset
          })
        }

        if (inputRef.current) {
          inputRef.current.setNativeProps({
            text: `${Math.round(v.value)}`
          })
        }
      })
    }, 100);

    return (() => {
      animatedValue.removeAllListeners()
      clearTimeout(timeoutId);
    })
  }, [max, percentage])


  return (
    <View>
      <View>
        <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`} style={{ alignSelf: "center" }}>
          <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
            <Circle
              cx="50%"
              cy="50%"
              stroke="#ddd"
              strokeWidth={strokeWidth}
              r={radius}
              fill="transparent"
            />
            <AnimatedCircle
              ref={circleRef}
              cx="50%"
              cy="50%"
              stroke={color}
              strokeWidth={strokeWidth}
              r={radius}
              fill="transparent"
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleCircumference}
              strokeLinecap='round'
            />
          </G>
        </Svg>
        <AnimatedInput
          ref={inputRef}
          underlineColorAndroid="transparent"
          editable={false}
          defaultValue='0'
          style={[StyleSheet.absoluteFillObject, { color: color, fontSize: radius / 3, fontWeight: "900", textAlign: "center" }]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  inputValue: {
    fontSize: 35,
    fontWeight: "900",
    textAlign: "center"
  }
})