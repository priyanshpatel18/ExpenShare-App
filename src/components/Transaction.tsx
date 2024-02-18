import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

type propsType = {
  title: string;
  amount: string;
  expense?: boolean;
  imageUrl: any;
}

export default function Transaction({ title, expense, amount, imageUrl }: propsType) {
  return (
    <View style={styles.transaction}>
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
        expense ? (
          <Text style={[styles.amount, expense ? styles.expenseAmount : styles.incomeAmount]}>
            {expense ? '-' : '+'}₹{amount}
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
    backgroundColor: "#dfdfdf",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 25
  },
  categoryIconContainer: {
    padding: 20,
    backgroundColor: "#FBC438",
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginRight: 10
  },
  categoryIcon: {
    height: 30,
    width: 30
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
    color: "#ff3838"
  },
  incomeAmount: {
    color: "#00b200"
  },
  amount: {
    fontSize: 18,
    color: "#000",
    fontFamily: "Montserrat-Medium"
  }
})