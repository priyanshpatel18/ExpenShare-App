import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GroupDocument, Store } from '../store/store'

type propsType = {
  group: GroupDocument;
}

export default function TotalsComponent({ group }: propsType) {
  const store = Store();

  const targetGroup = store.groups.find(grp => grp._id === group._id);
  const userName: string | undefined = store.userObject?.userName;
  let totalPaid: number = 0;
  let totalShare: number = 0;

  if (targetGroup) {
    targetGroup.groupExpenses.forEach(expense => {
      if (expense.paidBy.userName === userName) {
        totalPaid += expense.transactionAmount;
      }
      expense.splitAmong.forEach(member => {
        if (member.userName === userName) {
          totalShare += expense.transactionAmount / expense.splitAmong.length;
        }
      })
    })
  }


  return (
    <View>
      <View style={styles.propertyContainer}>
        <Text style={styles.propertyText}>
          Total Group Spending
        </Text>
        <Text style={styles.propertyValue}>₹{targetGroup?.totalExpense ? targetGroup.totalExpense.toFixed(2) : `0.00`}</Text>
      </View>
      <View style={styles.propertyContainer}>
        <Text style={styles.propertyText}>Total You Paid For</Text>
        <Text style={styles.propertyValue}>₹{totalPaid.toFixed(2)}</Text>
      </View>
      <View style={styles.propertyContainer}>
        <Text style={styles.propertyText}>Your Total Share</Text>
        <Text style={styles.propertyValue}>₹{totalShare.toFixed(2)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  propertyContainer: {
    marginBottom: 20
  },
  propertyText: {
    color: "#222",
    fontSize: 16,
    textTransform: "uppercase",
    fontFamily: "Montserrat-Medium",
  },
  propertyValue: {
    color: "#222",
    fontSize: 26,
    fontFamily: "Montserrat-SemiBold",
  }
})