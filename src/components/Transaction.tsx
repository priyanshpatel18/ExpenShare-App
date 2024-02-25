import { StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'

type propsType = {
  title: string;
  amount: string;
  type?: string;
  imageUrl: any;
}

export default function Transaction({ title, type, amount, imageUrl }: propsType): React.JSX.Element {
  const transactionAmount =
    Number(amount) > 100000 ?
      Number(amount) < 999999 ? `${Math.round(Number(amount) / 1000)}K`
        : `${Math.round(Number(amount) / 1000000)}M`
      : Number(amount);

  return (
    <View style={[
      styles.transaction,
      type === "expense" ? { backgroundColor: "#FDD" } :
        type === "income" ? { backgroundColor: "#DFD" } :
          { backgroundColor: "#CFCFCF" }
    ]}>
      <View style={styles.mainTransaction}>
        <View style={styles.categoryIconContainer}>
          <Image
            source={imageUrl}
            style={styles.categoryIcon}
          />
        </View>
        <Text style={styles.transactionDescription} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>

      {
        type ? (
          <Text style={[styles.amount, type === "expense" ? styles.expenseAmount : styles.incomeAmount]}>
            {type === "expense" ? '-' : '+'}₹{transactionAmount}
          </Text>
        ) : (
          <Text style={styles.amount}>
            ₹{transactionAmount}
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
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#aaa",
    borderWidth: 2,
  },
  mainTransaction: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIconContainer: {
    padding: 20,
    backgroundColor: "#fff",
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginRight: 10
  },
  categoryIcon: {
    height: 25,
    width: 25
  },
  transactionDescription: {
    flexShrink: 1,
    color: "#222",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 22,
    maxWidth: '80%',
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
    fontSize: 18,
    color: "#222",
    fontFamily: "Montserrat-Medium"
  }
})