import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

type propsType = {
  title: string;
  amount: string;
  type?: string;
  imageUrl: any;
}

export default function Transaction({ title, type, amount, imageUrl }: propsType) {
  return (
    <View style={[
      styles.transaction,
      type === "expense" ? { backgroundColor: "rgb(255, 173, 173)" } :
        type === "income" ? { backgroundColor: "rgb(170, 253, 166)" } :
          { backgroundColor: "#CFCFCF" }
    ]}>
      <View style={styles.categoryIconContainer}>
        <Image
          source={imageUrl}
          style={styles.categoryIcon}
        />
      </View>
      <Text style={styles.transactionDescription} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>

      {
        type ? (
          <Text style={[styles.amount, type === "expense" ? styles.expenseAmount : styles.incomeAmount]}>
            {type === "expense" ? '-' : '+'}₹{Number(amount) > 999999 ? Number(amount) / 1000000 + 'M' : Number(amount)}
          </Text>
        ) : (
          <Text style={styles.amount}>
            ₹{amount}
          </Text>
        )
      }

    </View>
  )
}

const styles = StyleSheet.create({
  transaction: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#CFCFCF",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 15
  },
  categoryIconContainer: {
    padding: 20,
    backgroundColor: "#fff",
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginRight: 10
  },
  categoryIcon: {
    height: 35,
    width: 35
  },
  transactionDescription: {
    flexShrink: 1,
    color: "#000",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 25,
    maxWidth: '60%',
    textTransform: "capitalize"
  },
  expenseAmount: {
    color: "#f00",
    fontFamily: "Montserrat-Bold"
  },
  incomeAmount: {
    color: "#00a200",
    fontFamily: "Montserrat-Bold"
  },
  amount: {
    fontSize: 20,
    color: "#000",
    fontFamily: "Montserrat-Medium"
  }
})