import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function HomePage(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Hello</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e6e6e6"
  },
  welcomeLogo: {
    height: 100,
    width: 100
  },
  headingText: {
    color: "#000",
    textTransform: "uppercase",
    fontSize: 30,
    fontFamily: "Montserrat-SemiBold"
  }
})