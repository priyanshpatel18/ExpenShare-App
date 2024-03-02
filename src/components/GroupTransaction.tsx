import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { GroupUser, Store } from '../store/store';

type propsType = {
  paidBy: GroupUser;
  splitAmong: GroupUser[];
  categoryIcon: any
  transactionTitle: string;
  transactionAmount: number;
  transactionDate: string;
}

export default function GroupTransaction({
  paidBy,
  splitAmong,
  categoryIcon,
  transactionTitle,
  transactionAmount,
  transactionDate }
  : propsType) {
  const store = Store();

  const DateObject = new Date(transactionDate);
  const month: Intl.DateTimeFormatOptions = { month: 'short' };
  const date = DateObject.getDate();
  const displayMonth = DateObject.toLocaleDateString('en-US', month);

  return (
    <View style={styles.transaction}>
      <View style={styles.leftPart}>
        <View >
          <Text style={styles.dateText}>{displayMonth}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <View style={styles.categoryIconContainer}>
          <Image
            style={styles.categoryIcon}
            source={categoryIcon}
          />
        </View>
        <View>
          <Text style={styles.title}>{transactionTitle}</Text>
          <Text style={styles.amount}>{paidBy.userName} paid ₹{transactionAmount}</Text>
        </View>
      </View>
      <View>
        <Text style={[
          styles.lentText,
          styles.rightPartText,
          paidBy.userName === store.userObject?.userName ? { color: "#00a200" } : { color: "#f00" }
        ]}>
          You {paidBy.userName === store.userObject?.userName ? " lent" : " borrowed"}
        </Text>
        <Text style={[
          styles.lentText,
          styles.rightPartText,
          paidBy.userName === store.userObject?.userName ? { color: "#00a200" } : { color: "#f00" }
        ]}>₹{(transactionAmount / splitAmong.length).toFixed(2)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  transaction: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15
  },
  leftPart: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  dateText: {
    textAlign: 'center',
    color: "#222",
    fontSize: 14
  },
  categoryIconContainer: {
    backgroundColor: "#e1e1e1",
    padding: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20
  },
  categoryIcon: {
    width: 20,
    height: 20,
  },
  title: {
    color: "#222",
    fontSize: 16
  },
  amount: {
    color: "#aaa",
    fontSize: 12
  },
  rightPartText: {
    fontSize: 12,
    alignSelf: "flex-end"
  },
  lentText: {
    color: "#00a200",
  },
  borrowedText: {
    color: "#f00",
  },
})