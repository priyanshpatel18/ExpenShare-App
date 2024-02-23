import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MenuBar from '../components/MenuBar';
import NoTransaction from '../components/NoTransaction';
import Transaction from '../components/Transaction';
import TransactionDetails from '../components/TransactionDetails';
import { getCategorySource as getExpenseCategorySource } from '../data/ExpenseCategories';
import { getCategorySource as getIncomeCategorySource } from '../data/IncomeCategories';
import { Store, TransactionType } from '../store/store';

type PropsType = {
  navigation: NavigationProp<any>;
};

interface TransactionDetailsRouteParams {
  transaction: TransactionType;
}

export default function TransactionPage({ navigation }: PropsType) {
  const [showIncome, setShowIncome] = useState(true);
  const [displayTransactions, setDisplayTransactions] = useState<TransactionType[] | undefined>(undefined);
  const [showNoTransaction, setShowNoTransaction] = useState<boolean>(false);
  const store = Store();

  const redirect = useNavigation();

  useEffect(() => {
    if (store.transactions) {
      if (showIncome) {
        const incomeTransactions = store.transactions.filter(transaction => transaction.type === 'income');
        if (incomeTransactions.length === 0) {
          setShowNoTransaction(true)
          return;
        }
        setShowNoTransaction(false)
        setDisplayTransactions(incomeTransactions);
      } else {
        const expenseTransactions = store.transactions.filter(transaction => transaction.type === 'expense');
        if (expenseTransactions.length === 0) {
          setShowNoTransaction(true)
          return;
        }
        setShowNoTransaction(false)
        setDisplayTransactions(expenseTransactions);
      }
    }
  }, [showIncome, store.transactions]);

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
      {showNoTransaction ? <NoTransaction /> : (
        <ScrollView style={styles.transactions}>
          {showIncome
            ? displayTransactions
              ?.filter(transaction => transaction.type === 'income')
              .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
              .map((transaction, index) => (
                <MotiView
                  key={index}
                  from={{
                    top: -400 * (index + 0.7),
                    zIndex: -9999
                  }}
                  animate={{
                    top: 0,
                    zIndex: 0
                  }}
                  transition={{
                    type: "timing",
                    duration: 700,
                    delay: index * 50
                  }}
                >
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate("TransactionDetails", { transaction, imageUrl: getIncomeCategorySource(transaction.category) })
                    }
                  >
                    <TransactionDetails transaction={transaction} />
                    <Transaction
                      title={transaction.transactionTitle}
                      amount={transaction.transactionAmount}
                      imageUrl={
                        getIncomeCategorySource(transaction.category)
                      }
                    />
                  </TouchableOpacity>
                </MotiView>
              ))
            : displayTransactions
              ?.filter(transaction => transaction.type === 'expense')
              .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
              .map((transaction, index) => (
                <MotiView
                  key={index}
                  from={{
                    top: -400 * (index + 1),
                    zIndex: -9999
                  }}
                  animate={{
                    top: 0,
                    zIndex: 0
                  }}
                  transition={{
                    type: "timing",
                    duration: 700,
                    delay: index * 50
                  }}
                >
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate("TransactionDetails", { transaction, imageUrl: getExpenseCategorySource(transaction.category) })
                    }
                  >
                    <TransactionDetails transaction={transaction} />
                    <Transaction
                      title={transaction.transactionTitle}
                      amount={transaction.transactionAmount}
                      imageUrl={
                        getExpenseCategorySource(transaction.category)
                      }
                    />
                  </TouchableOpacity>
                </MotiView>
              ))}
        </ScrollView>

      )}
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
    color: '#222',
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
    color: "#222",
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
    color: "#222",
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold"
  },
  transactions: {
    paddingHorizontal: 20,
    marginBottom: "25%"
  }
});
