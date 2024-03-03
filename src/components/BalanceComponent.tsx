import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { GroupDocument, Store } from '../store/store'
import BalanceUser from './BalanceUser';
import { ScrollView } from 'moti';

type propsType = {
  group: GroupDocument;
}

export default function BalanceComponent({ group }: propsType) {
  const store = Store()
  const targetGroup = store.groups.find(grp => grp._id === group._id);

  // Function to calculate total balance for each member
  const calculateTotalBalance = (userId: string) => {
    let totalBalance = 0;
    targetGroup?.balances.forEach(balance => {
      if (balance.creditor._id === userId) {
        totalBalance += balance.amount;
      }
      else if (balance.debtor._id === userId) {
        totalBalance -= balance.amount;
      }
    });

    return totalBalance.toFixed(2);
  }

  return (
    <ScrollView>
      {targetGroup?.members.map((member, index) => (
        <View
          key={index}
        >
          <BalanceUser
            userName={store.userObject?.userName}
            member={member}
            amount={Number(calculateTotalBalance(member._id))}
            targetGroup={targetGroup}
          />
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  balanceContainer: {

  }
})
