import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

type propsType = {
  totalBalance: string,
  income: string,
  expense: string,
}

export default function Balance() {
  return (
    <LinearGradient
      colors={['#2faae3', '#c968ff', '#e680b1', '#fb9475']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceContainer}
    >
      <View>
        <Text style={styles.balanceHeading}>Total Balance</Text>
        <Text style={styles.mainBalance}>₹0.00</Text>
        <View style={styles.boxContainer}>
          <View style={styles.box}>
            <View style={styles.balanceIconContainer}>
              <Image
                style={styles.balanceIcon}
                source={require("../assets/upArrow.png")}
              />
            </View>
            <View>
              <Text style={styles.boxText}>Income</Text>
              <Text style={styles.boxText}>₹0.00</Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.balanceIconContainer}>
              <Image
                style={styles.balanceIcon}
                source={require("../assets/downArrow.png")}
              />
            </View>
            <View>
              <Text style={styles.boxText}>Expense</Text>
              <Text style={styles.boxText}>₹0.00</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient >

  )
}

const styles = StyleSheet.create({
  balanceContainer: {
    margin: 20,
    borderRadius: 30,
    padding: 10
  },
  balanceHeading: {
    textAlign: "center",
    margin: 5,
    fontSize: 20,
    color: "#fff",
    fontFamily: "Montserrat-Bold"
  },
  mainBalance: {
    textAlign: "center",
    marginBottom: 5,
    fontSize: 45,
    color: "#fff",
    fontFamily: "Montserrat-ExtraBold"
  },
  boxContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20
  },
  box: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  boxText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold"
  },
  balanceIconContainer: {
    height: 30,
    width: 30,
    backgroundColor: "#fff",
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  balanceIcon: {
    height: 25,
    width: 25
  }
})