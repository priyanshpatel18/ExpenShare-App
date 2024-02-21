import React from 'react'
import { StyleSheet, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

type propsType = {
  text: string
}

export default function ({ text }: propsType): React.JSX.Element {
  return (
    <LinearGradient
      colors={['#2faae3', '#c968ff', '#e680b1', '#fb9475']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: 30,
    paddingVertical: 10
  },
  buttonText: {
    color: "#fff",
    textAlign: 'center',
    fontSize: 30,
    textTransform: "uppercase",
    fontFamily: "Montserrat-Bold",
    letterSpacing: 5
  }
})