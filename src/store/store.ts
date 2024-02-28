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
import socket from "../utils/socket";

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

export interface UserObject {
  _id: string;
  email: string;
  userName: string;
  profilePicture: string | undefined | null;
  totalBalance: number | undefined;
  totalIncome: number | undefined;
  totalExpense: number | undefined;
}

export interface GroupUser {
  _id: string;
  email: string;
  userName: string;
  profilePicture: string | undefined | null;
}

export interface GroupDocument {
  _id: string;
  groupName: string;
  groupProfile?: string | undefined;
  createdBy: GroupUser | undefined;
  members: GroupUser[];
  groupExpenses: TransactionType[];
  totalExpense: number;
  category: string;
}

export interface Notification {
  requestId: string;
  groupId: string;
  groupName: string;
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
  showSnackbar: (message: string) => void;
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
  // Handle Send Mail for OTP Verification (Password Reset)
  handleSendMail: (email: string, navigation: NavigationProp<any>) => void;
  // Send OTP Verification for Email Verification
  handleVerifyEmail: (otp: string, navigation: NavigationProp<any>) => void;
  // Reset Passeord
  handleResetPassword: (
    password: string,
    navigation: NavigationProp<any>,
    confirmPassword?: string,
  ) => void;
  // Fetch Transactions
  fetchTransactions: () => void;
  // Register
  handleRegister: (navigation: NavigationProp<any>) => void;
  // Get User
  fetchData: (navigation: NavigationProp<any>) => void;
  // Group State
  groups: GroupDocument[] | [];
  setGroups: (groups: GroupDocument[]) => void;
  // Create Group
  handleCreateGroup: (
    title: string,
    selectedImage: string | undefined | null,
    navigation: NavigationProp<any>,
  ) => void;
  // Delete Transaction
  handleDeleteTransaction: (
    transactionId: string,
    transactionAmount: string,
    navigation: NavigationProp<any>,
    type: string,
  ) => void;
  // FetchGroups
  handleFetchGroups: () => void;
  // Notifications
  notifications: Notification[];
  setNotifications: (notification: Notification[]) => void;
  // Handle Request
  handleRequest: (
    type: string,
    requestId: string,
    groupId: string,
    navigation: NavigationProp<any>,
  ) => void;

  // Handle Remove Member
  handleRemoveMember: (
    memberEmail: string,
    groupId: string,
    navigation: NavigationProp<any>,
  ) => void;
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

  showSnackbar: (message: string) => {
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
      Store.getState().showSnackbar("Enter All Credentials");
      return;
    }

    set({ loading: true });
    Store.getState().showSnackbar("Logging in...");

    const formData = {
      userNameOrEmail: String(userNameOrEmail.toLowerCase()),
      password,
    };

    axios
      .post(`/user/login`, formData)
      .then(async res => {
        await AsyncStorage.setItem("token", res.data.token);
        const token = res.data.token;
        Store.getState().fetchData(token);
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
        Store.getState().showSnackbar(res.data.message);
      })
      .catch(err => {
        Store.getState().showSnackbar(err.response.data.message);
      })
      .finally(() => {
        set({ loading: false });
      });
  },

  handleSendMail: (email, navigation) => {
    if (!email.trim()) {
      Store.getState().showSnackbar("Enter the Email");
    }

    set({ loading: true });
    Store.getState().showSnackbar("Sending Mail...");

    axios
      .post(`/user/sendMail`, { email })
      .then(async res => {
        Store.getState().showSnackbar(res.data.message);
        await AsyncStorage.setItem("otpId", res.data.otpId);
        navigation.navigate("VerifyOtp");
      })
      .catch(err => {
        console.log(err);
        Store.getState().showSnackbar(err.response.data.message);
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
        Store.getState().handleRegister(navigation);
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          Store.getState().showSnackbar(err.response.data.message);
        } else {
          console.error("Error:", err);
        }
      })
      .finally(async () => {
        set({ loading: false });
      });
  },

  handleRegister: async navigation => {
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

    Store.getState().showSnackbar("Creating your account");

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
        await AsyncStorage.setItem("token", res.data.token);

        Store.getState().fetchData(navigation);
        Store.getState().showSnackbar(res.data.message);
      })
      .catch(err => {
        if (axios.isAxiosError(err)) {
          Store.getState().showSnackbar(err.response?.data.message);
        } else {
          console.error("Error:", err);
        }
      })
      .finally(async () => {
        await AsyncStorage.removeItem("userDataId");
        await AsyncStorage.removeItem("otpId");
      });
  },

  fetchData: async navigation => {
    set({ loading: true });

    try {
      const [userDataResponse, _, __, requestResponse] = await Promise.all([
        axios.post("/user/getUser", {
          token: await AsyncStorage.getItem("token"),
        }),
        Store.getState().fetchTransactions(),
        Store.getState().handleFetchGroups(),
        axios.post("/user/getRequests", {
          token: await AsyncStorage.getItem("token"),
        }),
      ]);
      const userData = userDataResponse.data.user;
      const requestData = requestResponse.data.notifications;

      set({ notifications: requestData });

      set({ userObject: userData });
      set({ totalBalance: Number(userData.totalBalance) });
      set({ totalIncome: Number(userData.totalIncome) });
      set({ totalExpense: Number(userData.totalExpense) });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        navigation.navigate("Welcome");
        Store.getState().showSnackbar(error.response?.data.message);
      } else {
        console.error("Error fetching data:", error);
      }
    } finally {
      set({ loading: false });
    }
  },

  handleResetPassword: async (password, navigation, confirmPassword?) => {
    if (!Store.getState().isAuthenticatedChange) {
      if (
        !password ||
        !password.trim() ||
        !confirmPassword ||
        !confirmPassword.trim()
      ) {
        Store.getState().showSnackbar("Enter All Credentials");
        return;
      }

      if (password !== confirmPassword) {
        Store.getState().showSnackbar("Passwords must match");
        return;
      }
    }

    set({ loading: true });
    Store.getState().showSnackbar("Resetting");

    const formData = {
      password: password,
      email: await AsyncStorage.getItem("resetEmail"),
    };

    axios
      .post(`/user/resetPassword`, formData)
      .then(async res => {
        Store.getState().showSnackbar(res.data.message);
        if (!Store.getState().isAuthenticatedChange) {
          navigation.navigate("Login");
          return;
        }
        Store.getState().setIsAuthenticatedChange(false);
      })
      .catch(err => {
        console.log(err);
        Store.getState().showSnackbar(err.response?.data.message);
      })
      .finally(async () => {
        set({ loading: false });
      });
  },

  groups: [],
  setGroups: (groups: GroupDocument[]) => set({ groups }),

  handleCreateGroup: async (title, selectedImage, navigation) => {
    if (!title.trim()) {
      Store.getState().showSnackbar("Title is required");
      return;
    }

    set({ loading: true });
    Store.getState().showSnackbar("Creating...");

    const formData = new FormData();

    const token = await AsyncStorage.getItem("token");

    formData.append("groupName", title);
    formData.append("token", token);

    if (selectedImage) {
      const extension = selectedImage.split(".").pop();
      formData.append("groupProfile", {
        uri: selectedImage,
        name: `profilePicture.${extension}`,
        type: `image/${extension}`,
      });
    }

    axios
      .post("/group/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(res => {
        Store.getState().showSnackbar(res.data.message);

        console.log(res.data.group.members.length);

        // Add Group to store
        const newGroup: GroupDocument = {
          _id: res.data.group._id,
          groupName: title,
          groupProfile: selectedImage ? selectedImage : undefined,
          createdBy: res.data.group.createdBy,
          members: res.data.group.members,
          groupExpenses: [],
          totalExpense: 0,
          category: "NONE",
        };

        set({ groups: [...Store.getState().groups, newGroup] });
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
        set({ loading: false });
      });
  },

  handleDeleteTransaction: async (
    transactionId,
    transactionAmount,
    navigation,
    type,
  ) => {
    const token = await AsyncStorage.getItem("token");

    set({ loading: true });

    axios
      .post("/transaction/delete", { token, transactionId, transactionAmount })
      .then(res => {
        const { transactions } = Store.getState();

        if (transactions) {
          const updatedTransactions = transactions.filter(
            transaction => transaction._id !== transactionId,
          );
          set({ transactions: updatedTransactions });
        }
        const amount = Number(transactionAmount);
        let { totalBalance, totalIncome, totalExpense } = Store.getState();

        if (type === "income") {
          set({ totalBalance: (totalBalance -= amount) });
          set({ totalIncome: (totalIncome -= amount) });
        } else {
          set({ totalBalance: (totalBalance += amount) });
          set({ totalExpense: (totalExpense -= amount) });
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
        set({ loading: false });
      });
  },

  handleFetchGroups: async () => {
    const token = await AsyncStorage.getItem("token");

    axios.post("/group/getAll", { token }).then(res => {
      set({ groups: res.data.groups });
    });
  },

  notifications: [],
  setNotifications: (newNotification: Notification[]) => {
    set({
      notifications: [...Store.getState().notifications, ...newNotification],
    });
  },

  handleRequest: async (type, requestId, groupId, navigation) => {
    const token = await AsyncStorage.getItem("token");

    axios
      .post("/user/handleRequest", { token, requestId, type })
      .then(() => {
        if (type === "accept") {
          socket.emit("acceptRequest", { groupId: groupId });
          navigation.navigate("GroupPage");
        }
        set(prevState => ({
          notifications: prevState.notifications.filter(
            notification => notification.requestId !== requestId,
          ),
        }));
        Store.getState().showSnackbar(
          type === "accept" ? "Request Accepted" : "Request Rejected",
        );
      })
      .catch(err => {
        if (axios.isAxiosError(err)) {
          Store.getState().showSnackbar(err.response?.data.message);
        } else {
          console.error(err);
        }
      });
  },

  handleRemoveMember: async (memberEmail, groupId, navigation) => {
    const token = await AsyncStorage.getItem("token");

    set({ loading: true });

    axios
      .post("/group/removeMember", { token, memberEmail, groupId })
      .then(() => {
        socket.emit("removeMember", { groupId: groupId });
      })
      .catch(err => {
        if (axios.isAxiosError(err)) {
          Store.getState().showSnackbar(err.response?.data.message);
        } else {
          console.error(err);
        }
      })
      .finally(() => {
        set({ loading: false });
      });
  },
}));
