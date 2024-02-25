import { create } from "zustand";

export interface UserObject {
  email: string;
  userName: string;
  profilePicture: string | undefined | null;
  totalBalance: number | undefined;
  totalIncome: number | undefined;
  totalExpense: number | undefined;
}

interface UserState {
  // User Object
  userObject: UserObject | undefined;
  setUserObject: (userObject: UserObject | undefined) => void;
  // Total Balance
  totalBalance: number;
  setTotalBalance: (totalBalance: number) => void;
  // Total Income
  totalIncome: number;
  setTotalIncome: (totalIncome: number) => void;
  // Total Expense
  totalExpense: number;
  setTotalExpense: (totalExpense: number) => void;
}

export const UserStore = create<UserState>(set => ({
  userObject: undefined,
  setUserObject: userObject => set({ userObject }),

  totalBalance: 0,
  setTotalBalance: totalBalance => set({ totalBalance }),

  totalIncome: 0,
  setTotalIncome: totalIncome => set({ totalIncome }),

  totalExpense: 0,
  setTotalExpense: totalExpense => set({ totalExpense }),
}));
