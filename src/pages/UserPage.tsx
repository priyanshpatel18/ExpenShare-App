import { NavigationProp } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MenuBar from '../components/MenuBar'

type propsType = {
  navigation: NavigationProp<any>
}

export default function UserPage({ navigation }: propsType) {
  return (
    <View style={styles.container}>
      <Text>UserPage</Text>
      <MenuBar navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    backgroundColor: "#fff"
  },
})