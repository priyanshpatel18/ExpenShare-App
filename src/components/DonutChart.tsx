import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Donut from './Donut'
import { Store } from '../store/store'

export default function DonutChart() {
  const store = Store();

  return (
    <View style={styles.container}>
      <View style={styles.donutContainer}>
        <Donut
          percentage={store.totalIncome}
          color='#1E90FF'
          max={store.totalIncome}
        />
        <Text style={styles.title}>Total Incomes</Text>
      </View>
      <View style={styles.donutContainer}>
        <Donut
          percentage={store.totalBalance}
          color='#38D39F'
          max={store.totalIncome}
        />
        <Text style={styles.title}>Total Balance</Text>
      </View>
      <View style={styles.donutContainer}>
        <Donut
          percentage={store.totalExpense}
          color='#ff4757'
          max={store.totalIncome}
        />
        <Text style={styles.title}>Total Expenses</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  donutContainer: {
    display: "flex",
    alignItems: "center"
  },
  title: {
    color: "#222",
    fontSize: 20,
    width: "70%",
    textAlign: "center"
  }
})