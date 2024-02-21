import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

export default function NoTransaction(): React.JSX.Element {
  return (
    <View style={styles.noTransaction}>
      <Image
        source={require("../assets/wallet.png")}
        style={styles.emptyWallet}
      />
      <Text style={styles.noText}>
        No Transactions Yet
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  noTransaction: {
    paddingTop: 50,
    alignItems: "center"
  },
  emptyWallet: {
    height: 100,
    width: 100
  },
  noText: {
    color: "#aaa",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 22
  },
})