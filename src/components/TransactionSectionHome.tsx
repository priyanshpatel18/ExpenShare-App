import { NavigationProp } from '@react-navigation/native'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Transaction from './Transaction'

type propsType = {
  navigation: NavigationProp<any>
}

export default function TransactionSectionHome({ navigation }: propsType) {

  return (
    <View style={styles.container}>
      <View style={styles.transactionContainer}>
        <Text style={styles.transactionHeading}>Transactions</Text>
        <Text
          onPress={() => { navigation.navigate("Transaction"); }}
          style={styles.transactionLink}
        >
          View All
        </Text>
      </View>
      {/* <View style={styles.noTransaction}>
        <Image
          source={require("../assets/wallet.png")}
          style={styles.emptyWallet}
        />
        <Text style={styles.noText}>
          No Transactions Yet
        </Text>
      </View> */}
      <ScrollView style={styles.transactions}>
        <Transaction
          title='food bill'
          amount='50.00'
          expense={true}
          imageUrl={require("../assets/food.png")}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  transactionContainer: {
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15
  },
  transactionHeading: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Montserrat-Bold"
  },
  transactionLink: {
    color: "#539AEA",
    fontFamily: "Montserrat-SemiBold"
  },
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
  transactions: {
    padding: 20,
  },
})