import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { GroupDocument } from '../store/store'
import GroupTransaction from './GroupTransaction';
import { getCategorySource } from '../data/ExpenseCategories';
import { NavigationProp } from '@react-navigation/native';

type propsType = {
  group: GroupDocument;
  navigation: NavigationProp<any>
}

export default function TransactionsComponent({ group, navigation }: propsType) {
  return (
    <View style={styles.container}>
      <ScrollView>
        {group.groupExpenses.map((transaction) => (
          <GroupTransaction
            transactionTitle={transaction.transactionTitle}
            transactionAmount={transaction.transactionAmount}
            transactionDate={transaction.transactionDate}
            paidBy={transaction.paidBy}
            splitAmong={transaction.splitAmong}
            categoryIcon={getCategorySource(transaction.transactionTitle)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate("AddGroupTransaction", { group })}
        style={styles.addButtonContainer}
      >
        <Image
          source={require("../assets/addButton.png")}
          style={styles.addButtonIcon}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  addButtonContainer: {
    position: "absolute",
    bottom: "5%",
    alignSelf: "center"
  },
  addButtonIcon: {
    alignSelf: "center",
    width: 70,
    height: 70,
  },
})