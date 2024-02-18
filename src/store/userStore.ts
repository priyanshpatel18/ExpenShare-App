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
import { Transaction } from "../pages/TransactionPage";

const userServer = "https://expen-share-app-server.vercel.app";

interface UserStoreState {
  loading: boolean;
  setLoading: (loading: boolean) => void;

  expenseTitle: string;
  setExpenseTitle: (title: string) => void;

  expenseIcon: any;
  setExpenseIcon: (icon: any) => void;

  incomeTitle: string;
  setIncomeTitle: (title: string) => void;

  incomeIcon: any;
  setIncomeIcon: (icon: any) => void;

  transactionType: string;
  setTransactionType: (type: string) => void;

  showToastWithGravityAndOffset: (message: string) => void;
  pickImage: (
    setImage: React.Dispatch<React.SetStateAction<string | null | undefined>>,
  ) => void;

  handleLogin: (
    userNameOrEmail: string,
    password: string,
    navigation: NavigationProp<any>,
  ) => void;

  handleSendMail: (email: string, navigation: NavigationProp<any>) => void;

  handleVerifyEmail: (otp: string, navigation: NavigationProp<any>) => void;

  handleResetPassword: (
    password: string,
    confirmPassword: string,
    navigation: NavigationProp<any>,
  ) => void;

  fetchTransactions: (
    setTransactions: React.Dispatch<
      React.SetStateAction<undefined | Transaction[]>
    >,
  ) => void;
}

export const userStore = create<UserStoreState>(set => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),

  expenseTitle: "AIR TICKETS",
  setExpenseTitle: expenseTitle => set({ expenseTitle }),

  expenseIcon: require("../assets/categories/airTickets.png"),
  setExpenseIcon: expenseIcon => set({ expenseIcon }),

  incomeTitle: "BONUS",
  setIncomeTitle: incomeTitle => set({ incomeTitle }),

  incomeIcon: require("../assets/categories/bonus.png"),
  setIncomeIcon: incomeIcon => set({ incomeIcon }),

  transactionType: "expense",
  setTransactionType: transactionType => set({ transactionType }),

  fetchTransactions: async setTransactions => {
    const email = await AsyncStorage.getItem("email");

    axios
      .post("http://192.168.114.48:5555/transaction/getAll", { email })
      .then(res => {
        setTransactions(res.data.transactions);
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
      userStore
        .getState()
        .showToastWithGravityAndOffset("Enter All Credentials");
      return;
    }

    set({ loading: true });

    const formData = {
      userNameOrEmail: String(userNameOrEmail.toLowerCase()),
      password,
    };

    axios
      .post(`${userServer}/user/login`, formData)
      .then(async res => {
        await AsyncStorage.setItem("email", userNameOrEmail);
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
        userStore.getState().showToastWithGravityAndOffset(res.data.message);
      })
      .catch(err => {
        console.log(err);
        userStore
          .getState()
          .showToastWithGravityAndOffset(err.response.data.message);
      })
      .finally(() => {
        set({ loading: false });
      });
  },

  handleSendMail: (email, navigation) => {
    if (!email.trim()) {
      userStore.getState().showToastWithGravityAndOffset("Enter the Email");
    }

    set({ loading: true });
    userStore.getState().showToastWithGravityAndOffset("Sending Mail...");

    axios
      .post(`${userServer}/user/sendMail`, { email })
      .then(async res => {
        userStore.getState().showToastWithGravityAndOffset(res.data.message);
        await AsyncStorage.setItem("otpId", res.data.otpId);
        navigation.navigate("VerifyOtp");
      })
      .catch(err => {
        console.log(err);
        userStore
          .getState()
          .showToastWithGravityAndOffset(err.response.data.message);
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
      .post(`${userServer}/user/verifyOtp`, { userOtp: otp, otpId })
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

        userStore
          .getState()
          .showToastWithGravityAndOffset("Creating your account");
        axios
          .post(`${userServer}/user/register`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(async res => {
            await AsyncStorage.setItem("email", res.data.email);
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
            userStore
              .getState()
              .showToastWithGravityAndOffset(res.data.message);
          })
          .catch(err => {
            if (
              err.response &&
              err.response.data &&
              err.response.data.message
            ) {
              userStore
                .getState()
                .showToastWithGravityAndOffset(err.response.data.message);
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
          userStore
            .getState()
            .showToastWithGravityAndOffset(err.response.data.message);
        } else {
          console.error("Error:", err);
        }
      })
      .finally(async () => {
        set({ loading: false });
      });
  },

  handleResetPassword: async (password, confirmPassword, navigation) => {
    if (
      !password ||
      !password.trim() ||
      !confirmPassword ||
      !confirmPassword.trim()
    ) {
      userStore
        .getState()
        .showToastWithGravityAndOffset("Enter All Credentials");
      return;
    }

    if (password !== confirmPassword) {
      userStore
        .getState()
        .showToastWithGravityAndOffset("Passwords must match");
      return;
    }

    set({ loading: true });
    userStore.getState().showToastWithGravityAndOffset("Resetting");

    const formData = {
      password: password,
      email: await AsyncStorage.getItem("resetEmail"),
    };

    axios
      .post(`${userServer}/user/resetPassword`, formData)
      .then(res => {
        userStore.getState().showToastWithGravityAndOffset(res.data.message);
        navigation.navigate("Login");
      })
      .catch(err => {
        console.log(err);
        userStore
          .getState()
          .showToastWithGravityAndOffset(err.response?.data.message);
      })
      .finally(async () => {
        set({ loading: false });
      });
  },

  handleCreateExpense: () => {},
}));
