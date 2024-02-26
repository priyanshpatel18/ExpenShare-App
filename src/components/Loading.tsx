import { MotiView } from 'moti'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function Loading() {
  return (
    <View style={styles.loadingContainer}>
      <MotiView
        from={{
          opacity: 0,
          width: 100,
          height: 100,
          borderRadius: 100 / 2,
          borderWidth: 0,
        }}
        animate={{
          opacity: 1,
          width: 100 + 20,
          height: 100 + 20,
          borderRadius: (100 + 20) / 2,
          borderWidth: 100 / 10,
        }}
        transition={{
          type: "timing",
          duration: 1000,
          loop: true,
        }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 100 / 2,
          borderWidth: 100 / 10,
          borderColor: "#222",
        }} />
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    display: "flex",
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  }
})