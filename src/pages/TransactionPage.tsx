import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MenuBar from '../components/MenuBar'
import { NavigationProp } from '@react-navigation/native';

type propsType = {
  navigation: NavigationProp<any>
}

export default function TransactionPage({ navigation }: propsType) {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      <MenuBar navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    backgroundColor: "#fff"
  }
})