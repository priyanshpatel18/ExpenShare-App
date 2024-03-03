import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { GroupDocument, Store } from '../store/store'
import GroupTransaction from './GroupTransaction';
import { getCategorySource } from '../data/ExpenseCategories';
import { NavigationProp } from '@react-navigation/native';

type propsType = {
  group: GroupDocument;
  navigation: NavigationProp<any>
}

export default function TransactionsComponent({ group, navigation }: propsType) {
  const store = Store();
  const targetGroup = store.groups.find(grp => grp._id === group._id);

  return (
    <View style={styles.container}>
      <ScrollView>
        {targetGroup?.groupExpenses.map((transaction, index) => (
          <GroupTransaction
            key={index}
            transactionTitle={transaction.transactionTitle}
            transactionAmount={transaction.transactionAmount}
            transactionDate={transaction.transactionDate}
            paidBy={transaction.paidBy}
            splitAmong={transaction.splitAmong}
            categoryIcon={getCategorySource(transaction.category)}
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