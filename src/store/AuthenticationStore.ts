import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { create } from "zustand";
import { TransactionStore } from "./TransactionStore";
import { Store } from "./Store";

interface AuthenticationState {
  // Change Pass Flag
  isAuthenticatedChange: boolean;
  setIsAuthenticatedChange: (isAuthenticatedChange: boolean) => void;
  // New Password
  password: string;
  setPassword: (password: string) => void;
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
  // Register
  handleRegister: (navigation: NavigationProp<any>) => void;
  // // Reset Passeord
  handleResetPassword: (
    password: string,
    navigation: NavigationProp<any>,
    confirmPassword?: string,
  ) => void;
}

export const AuthenticationStore = create<AuthenticationState>(set => ({
  isAuthenticatedChange: false,
  setIsAuthenticatedChange: (isAuthenticatedChange: boolean) =>
    set({ isAuthenticatedChange }),

  password: "",
  setPassword: password => set({ password }),

  handleLogin: (userNameOrEmail, password, navigation) => {
    if (!userNameOrEmail.trim() || !password.trim()) {
      Store.getState().showSnackbar("Enter All Credentials");
      return;
    }

    Store.setState({ loading: true });
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
        Store.getState().handleFetchData(token);
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
        Store.setState({ loading: false });
      });
  },

  handleSendMail: (email, navigation) => {
    if (!email.trim()) {
      Store.getState().showSnackbar("Enter the Email");
    }

    Store.setState({ loading: true });
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
        Store.setState({ loading: false });
      });
  },

  handleVerifyEmail: async (otp, navigation) => {
    Store.setState({ loading: true });

    if (!otp.trim()) {
      return;
    }
    const otpId = await AsyncStorage.getItem("otpId");

    axios
      .post("/user/verifyOtp", { userOtp: otp, otpId })
      .then(async () => {
        AuthenticationStore.getState().handleRegister(navigation);
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          Store.getState().showSnackbar(err.response.data.message);
        } else {
          console.error("Error:", err);
        }
      })
      .finally(async () => {
        Store.setState({ loading: false });
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

        TransactionStore.getState().fetchTransactions();
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

  handleResetPassword: async (password, navigation, confirmPassword?) => {
    if (!AuthenticationStore.getState().isAuthenticatedChange) {
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

    Store.setState({ loading: true });
    Store.getState().showSnackbar("Resetting");

    const formData = {
      password: password,
      email: await AsyncStorage.getItem("resetEmail"),
    };

    axios
      .post(`/user/resetPassword`, formData)
      .then(async res => {
        Store.getState().showSnackbar(res.data.message);
        if (!AuthenticationStore.getState().isAuthenticatedChange) {
          navigation.navigate("Login");
          return;
        }
        set({ isAuthenticatedChange: false });
      })
      .catch(err => {
        console.log(err);
        Store.getState().showSnackbar(err.response?.data.message);
      })
      .finally(async () => {
        Store.setState({ loading: false });
      });
  },
}));
