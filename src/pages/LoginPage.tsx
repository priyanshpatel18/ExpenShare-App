import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function LoginPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>LoginPage</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    
  },
  headingText: {
    color: "#000"
  }
})