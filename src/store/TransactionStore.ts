import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { create } from "zustand";
import { UserStore } from "./UserStore";
import { Store } from "./Store";

export interface TransactionType {
  _id: string;
  transactionAmount: string;
  category: string;
  transactionTitle: string;
  transactionDate: string;
  type: string;
  notes: string;
  invoiceUrl: string;
}

interface TransactionState {
  // Transaction Type
  transactionType: string;
  setTransactionType: (type: string) => void;
  // Default Expense Category Name
  expenseTitle: string;
  setExpenseTitle: (title: string) => void;
  // Default Expense Category Icon
  expenseIcon: any;
  setExpenseIcon: (icon: any) => void;
  // Default Income Category Icon
  incomeTitle: string;
  setIncomeTitle: (title: string) => void;
  // Default Income Category Icon
  incomeIcon: any;
  setIncomeIcon: (icon: any) => void;
  // Transactions
  transactions: TransactionType[];
  setTransactions: (transactions: TransactionType[] | undefined) => void;
  // Fetch Transactions
  fetchTransactions: () => void;
  // Delete Transaction
  handleDeleteTransaction: (
    transactionId: string,
    transactionAmount: string,
    navigation: NavigationProp<any>,
    type: string,
  ) => void;
}

export const TransactionStore = create<TransactionState>(set => ({
  transactionType: "expense",
  setTransactionType: transactionType => set({ transactionType }),

  expenseTitle: "AIR TICKETS",
  setExpenseTitle: expenseTitle => set({ expenseTitle }),

  expenseIcon: require("../assets/categories/airTickets.png"),
  setExpenseIcon: expenseIcon => set({ expenseIcon }),

  incomeTitle: "BONUS",
  setIncomeTitle: incomeTitle => set({ incomeTitle }),

  incomeIcon: require("../assets/categories/bonus.png"),
  setIncomeIcon: incomeIcon => set({ incomeIcon }),

  transactions: [],
  setTransactions: transactions => set({ transactions }),

  fetchTransactions: async () => {
    // Get Token
    const token = await AsyncStorage.getItem("token");
    // Fetch Transactions
    axios
      .post("/transaction/getAll", { token })
      .then(res => {
        set({ transactions: res.data.transactions });
      })
      .catch(err => {
        console.log(err);
      });
  },

  handleDeleteTransaction: async (
    transactionId,
    transactionAmount,
    navigation,
    type,
  ) => {
    const token = await AsyncStorage.getItem("token");

    Store.setState({ loading: true });

    axios
      .post("/transaction/delete", { token, transactionId, transactionAmount })
      .then(res => {
        const { transactions } = TransactionStore.getState();

        if (transactions) {
          const updatedTransactions = transactions.filter(
            transaction => transaction._id !== transactionId,
          );
          set({ transactions: updatedTransactions });
        }
        const amount = Number(transactionAmount);
        let { totalBalance, totalIncome, totalExpense } = UserStore.getState();

        if (type === "income") {
          UserStore.setState({ totalBalance: (totalBalance -= amount) });
          UserStore.setState({ totalIncome: (totalIncome -= amount) });
        } else {
          UserStore.setState({ totalBalance: (totalBalance += amount) });
          UserStore.setState({ totalExpense: (totalExpense -= amount) });
        }
        Store.getState().showSnackbar(res.data.message);
        navigation.goBack();
      })
      .catch(err => {
        if (axios.isAxiosError(err)) {
          Store.getState().showSnackbar(err.response?.data.message);
        } else {
          console.error(err);
        }
      })
      .finally(() => {
        Store.setState({ loading: false });
      });
  },
}));
