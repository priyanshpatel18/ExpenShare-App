import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MenuBar from '../components/MenuBar';
import Transaction from '../components/Transaction';
import { userStore } from '../store/userStore';
import TransactionDetails from '../components/TransactionDetails';

type PropsType = {
  navigation: NavigationProp<any>;
};

export interface Transaction {
  transactionAmount: string;
  category: string;
  transactionTitle: string;
  transactionDate: string;
  type: string;
}

export default function TransactionPage({ navigation }: PropsType) {
  const [showIncome, setShowIncome] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[] | undefined>(undefined);
  const [displayTransactions, setDisplayTransactions] = useState<Transaction[] | undefined>(undefined);

  const store = userStore();

  useEffect(() => {
    const fetchData = async () => {
      store.fetchTransactions(setTransactions);
    };

    fetchData();
  }, [transactions]);

  useEffect(() => {
    if (transactions) {
      if (showIncome) {
        const incomeTransactions = transactions.filter(transaction => transaction.type === 'income');
        setDisplayTransactions(incomeTransactions);
      } else {
        const expenseTransactions = transactions.filter(transaction => transaction.type === 'expense');
        setDisplayTransactions(expenseTransactions);
      }
    }
  }, [showIncome, transactions]);

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Transactions</Text>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          onPress={() => setShowIncome(true)}>
          {showIncome ? (
            <LinearGradient
              colors={['#2faae3', '#c968ff', '#e680b1', '#fb9475']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.switchButton}
            >
              <Text style={styles.activeButtonText}>income</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.switchButtonText}>Income</Text>
          )}

        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowIncome(false)}>
          {!showIncome ? (
            <LinearGradient
              colors={['#2faae3', '#c968ff', '#e680b1', '#fb9475']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.switchButton}
            >
              <Text style={styles.activeButtonText}>expense</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.switchButtonText}>expense</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.transactions}>
        {displayTransactions
          ?.sort((a, b) => {
            return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
          })
          .map((transaction, index) => (
            <View key={index}>
              <TransactionDetails transaction={transaction} />
              <Transaction
                title={transaction.transactionTitle}
                amount={transaction.transactionAmount}
                imageUrl={require("../assets/food.png")}
              />
            </View>
          ))}
      </ScrollView>

      <MenuBar navigation={navigation} />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center"
  },
  headingText: {
    fontFamily: "Montserrat-SemiBold",
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    padding: 10,
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#CFCFCF",
    padding: 10,
    borderRadius: 10,
    gap: 10
  },
  switchButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#EEE',
    borderRadius: 5,
  },

  switchButtonText: {
    color: "#000",
    fontSize: 22,
    textTransform: "uppercase",
    fontFamily: "Montserrat-SemiBold"
  },
  activeButtonText: {
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 22,
    fontFamily: "Montserrat-Bold"
  },

  transactionDetails: {
    width: "100%",
    marginVertical: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  details: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold"
  },
  transactions: {
    paddingHorizontal: 20,
    marginBottom: "25%"
  }
});
