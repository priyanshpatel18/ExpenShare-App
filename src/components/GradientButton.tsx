import React from 'react'
import { StyleSheet, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

type propsType = {
  text: string
  style?: any
}

export default function GradientButton({ text, style }: propsType): React.JSX.Element {
  return (
    <LinearGradient
      colors={['#2faae3', '#c968ff', '#e680b1', '#fb9475']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradient}
    >
      <Text style={style}>{text}</Text>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: 30,
    paddingVertical: 10
  },
})