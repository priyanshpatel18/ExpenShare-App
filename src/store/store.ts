import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { ToastAndroid } from "react-native";
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from "react-native-image-picker";
import { create } from "zustand";

export interface TransactionType {
  transactionAmount: string;
  category: string;
  transactionTitle: string;
  transactionDate: string;
  type: string;
}

export interface UserObject {
  email: string;
  userName: string;
  profilePicture: string | undefined | null;
  totalBalance: number | undefined;
  totalIncome: number | undefined;
  totalExpense: number | undefined;
}

interface StoreState {
  // Loading State
  loading: boolean;
  setLoading: (loading: boolean) => void;
  // Theme
  mode: string;
  setMode: (mode: string) => void;
  // User Object
  userObject: UserObject | undefined;
  setUserObject: (userObject: UserObject | undefined) => void;
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
  //Total Values
  totalBalance: number;
  setTotalBalance: (totalBalance: number) => void;
  totalIncome: number;
  setTotalIncome: (totalIncome: number) => void;
  totalExpense: number;
  setTotalExpense: (totalExpense: number) => void;
  // Change Pass Flag
  isAuthenticatedChange: boolean;
  setIsAuthenticatedChange: (isAuthenticatedChange: boolean) => void;
  // New Password
  password: string;
  setPassword: (password: string) => void;

  // Transaction Type
  transactionType: string;
  setTransactionType: (type: string) => void;
  // Transactions
  transactions: TransactionType[] | undefined;
  setTransactions: (transactions: TransactionType[] | undefined) => void;
  // Snackbar
  showToastWithGravityAndOffset: (message: string) => void;
  // Pick Image
  pickImage: (
    setImage: React.Dispatch<React.SetStateAction<string | undefined | null>>,
  ) => void;
  // Handle Login
  handleLogin: (
    userNameOrEmail: string,
    password: string,
    navigation: NavigationProp<any>,
  ) => void;
  // Handle Send Mail
  handleSendMail: (email: string, navigation: NavigationProp<any>) => void;

  handleVerifyEmail: (otp: string, navigation: NavigationProp<any>) => void;

  handleResetPassword: (
    password: string,
    navigation: NavigationProp<any>,
    confirmPassword?: string,
  ) => void;

  fetchTransactions: () => void;
}

export const Store = create<StoreState>(set => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),

  mode: "light",
  setMode: mode => set({ mode }),

  userObject: undefined,
  setUserObject: userObject => set({ userObject }),

  expenseTitle: "AIR TICKETS",
  setExpenseTitle: expenseTitle => set({ expenseTitle }),

  totalBalance: 0,
  setTotalBalance: totalBalance => set({ totalBalance }),
  totalIncome: 0,
  setTotalIncome: totalIncome => set({ totalIncome }),
  totalExpense: 0,
  setTotalExpense: totalExpense => set({ totalExpense }),

  isAuthenticatedChange: false,
  setIsAuthenticatedChange: (isAuthenticatedChange: boolean) =>
    set({ isAuthenticatedChange }),

  password: "",
  setPassword: (password: string) => set({ password }),

  expenseIcon: require("../assets/categories/airTickets.png"),
  setExpenseIcon: expenseIcon => set({ expenseIcon }),

  incomeTitle: "BONUS",
  setIncomeTitle: incomeTitle => set({ incomeTitle }),

  incomeIcon: require("../assets/categories/bonus.png"),
  setIncomeIcon: incomeIcon => set({ incomeIcon }),

  transactionType: "expense",
  setTransactionType: transactionType => set({ transactionType }),

  transactions: undefined,
  setTransactions: transactions => set({ transactions }),

  fetchTransactions: async () => {
    const token = await AsyncStorage.getItem("token");

    axios
      .post("/transaction/getAll", { token })
      .then(res => {
        set({ transactions: res.data.transactions });
      })
      .catch(err => {
        console.log(err);
      });
  },

  showToastWithGravityAndOffset: (message: string) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  },

  pickImage: setImage => {
    let options: ImageLibraryOptions = {
      mediaType: "photo",
    };

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (
        response.assets &&
        response.assets.length > 0 &&
        !response.didCancel
      ) {
        const image = response.assets[0].uri;
        setImage(image);
      }
    });
  },

  handleLogin: (userNameOrEmail, password, navigation) => {
    if (!userNameOrEmail.trim() || !password.trim()) {
      Store.getState().showToastWithGravityAndOffset("Enter All Credentials");
      return;
    }

    set({ loading: true });

    const formData = {
      userNameOrEmail: String(userNameOrEmail.toLowerCase()),
      password,
    };

    axios
      .post(`/user/login`, formData)
      .then(async res => {
        await AsyncStorage.setItem("token", res.data.token);
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
        Store.getState().showToastWithGravityAndOffset(res.data.message);
      })
      .catch(err => {
        console.log(err);
        Store.getState().showToastWithGravityAndOffset(
          err.response.data.message,
        );
      })
      .finally(() => {
        set({ loading: false });
      });
  },

  handleSendMail: (email, navigation) => {
    if (!email.trim()) {
      Store.getState().showToastWithGravityAndOffset("Enter the Email");
    }

    set({ loading: true });
    Store.getState().showToastWithGravityAndOffset("Sending Mail...");

    axios
      .post(`/user/sendMail`, { email })
      .then(async res => {
        Store.getState().showToastWithGravityAndOffset(res.data.message);
        await AsyncStorage.setItem("otpId", res.data.otpId);
        navigation.navigate("VerifyOtp");
      })
      .catch(err => {
        console.log(err);
        Store.getState().showToastWithGravityAndOffset(
          err.response.data.message,
        );
      })
      .finally(() => {
        set({ loading: false });
      });
  },

  handleVerifyEmail: async (otp, navigation) => {
    set({ loading: true });

    if (!otp.trim()) {
      return;
    }
    const otpId = await AsyncStorage.getItem("otpId");

    axios
      .post("/user/verifyOtp", { userOtp: otp, otpId })
      .then(async () => {
        const formData = new FormData();
        const userDataId = await AsyncStorage.getItem("userDataId");
        const selectedImage = await AsyncStorage.getItem("selectedImage");
        formData.append("userDataId", userDataId);

        if (selectedImage) {
          const extension = selectedImage.split(".").pop();
          formData.append("profilePicture", {
            uri: selectedImage,
            name: `profilePicture.${extension}`,
            type: `image/${extension}`,
          });
        }

        Store.getState().showToastWithGravityAndOffset("Creating your account");
        axios
          .post(`/user/register`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(async res => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
            Store.getState().showToastWithGravityAndOffset(res.data.message);
          })
          .catch(err => {
            if (
              err.response &&
              err.response.data &&
              err.response.data.message
            ) {
              Store.getState().showToastWithGravityAndOffset(
                err.response.data.message,
              );
            } else {
              console.error("Error:", err);
            }
          })
          .finally(async () => {
            await AsyncStorage.removeItem("userDataId");
            await AsyncStorage.removeItem("otpId");
          });
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          Store.getState().showToastWithGravityAndOffset(
            err.response.data.message,
          );
        } else {
          console.error("Error:", err);
        }
      })
      .finally(async () => {
        set({ loading: false });
      });
  },

  handleResetPassword: async (password, navigation, confirmPassword?) => {
    if (!Store.getState().isAuthenticatedChange) {
      if (
        !password ||
        !password.trim() ||
        !confirmPassword ||
        !confirmPassword.trim()
      ) {
        Store.getState().showToastWithGravityAndOffset("Enter All Credentials");
        return;
      }

      if (password !== confirmPassword) {
        Store.getState().showToastWithGravityAndOffset("Passwords must match");
        return;
      }
    }

    set({ loading: true });
    Store.getState().showToastWithGravityAndOffset("Resetting");

    const formData = {
      password: password,
      email: await AsyncStorage.getItem("resetEmail"),
    };

    axios
      .post(`/user/resetPassword`, formData)
      .then(async res => {
        Store.getState().showToastWithGravityAndOffset(res.data.message);
        if (!Store.getState().isAuthenticatedChange) {
          navigation.navigate("Login");
          return;
        }
        Store.getState().setIsAuthenticatedChange(false);
      })
      .catch(err => {
        console.log(err);
        Store.getState().showToastWithGravityAndOffset(
          err.response?.data.message,
        );
      })
      .finally(async () => {
        set({ loading: false });
      });
  },

  handleCreateExpense: () => {},
}));
