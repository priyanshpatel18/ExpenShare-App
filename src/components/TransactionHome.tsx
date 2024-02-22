import { NavigationProp } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { getCategorySource as getExpenseCategorySource } from '../data/ExpenseCategories'
import { getCategorySource as getIncomeCategorySource } from '../data/IncomeCategories'
import { Store, TransactionType } from '../store/store'
import NoTransaction from './NoTransaction'
import Transaction from './Transaction'
import { MotiView } from 'moti'

type propsType = {
  navigation: NavigationProp<any>
}

export default function TransactionSectionHome({ navigation }: propsType): React.JSX.Element {
  const store = Store();
  const [displayTransactions, setDisplayTransactions] = useState<TransactionType[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      store.fetchTransactions();
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (store.transactions) {
      const sortedTransactions = [...store.transactions].sort((a, b) => {
        return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
      });

      const lastFiveTransactions = sortedTransactions.slice(0, 5);

      setDisplayTransactions(lastFiveTransactions);
    }
  }, [store.transactions]);


  return (
    <View style={styles.container}>
      <View style={styles.transactionContainer}>
        <Text style={styles.transactionHeading}>Transactions</Text>
        <Text
          onPress={() => navigation.navigate("Transaction")}
          style={styles.transactionLink}
        >
          View All
        </Text>
      </View>

      {displayTransactions?.length !== 0 ? (
        <ScrollView style={styles.transactions}>
          {displayTransactions?.map((transaction, index) => {
            return (
              <MotiView key={index}
                from={{
                  opacity: 0,
                  bottom: (index + 1) * -300
                }}
                animate={{
                  opacity: 1,
                  bottom: 0
                }}
                transition={{
                  type: "timing",
                  duration: 700
                }}
              >
                <View>
                  <Transaction
                    type={transaction.type}
                    title={transaction.transactionTitle}
                    amount={transaction.transactionAmount}
                    imageUrl={transaction.type === "expense" ?
                      getExpenseCategorySource(transaction.category) :
                      getIncomeCategorySource(transaction.category)}
                  />
                </View>

              </MotiView>
            )
          })}
        </ScrollView>
      ) : (
        <NoTransaction />
      )
      }
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  transactionContainer: {
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  transactionHeading: {
    color: "#222",
    fontSize: 18,
    fontFamily: "Montserrat-Bold"
  },
  transactionLink: {
    color: "#539AEA",
    fontFamily: "Montserrat-SemiBold"
  },
  transactions: {
    paddingHorizontal: 20,
    marginBottom: "25%",
  },
})