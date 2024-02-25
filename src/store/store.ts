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
import { GroupStore } from "./GroupStore";
import { TransactionStore, TransactionType } from "./TransactionStore";
import { UserObject, UserStore } from "./UserStore";

export interface Group {
  groupName: string;
  groupProfile?: string | undefined;
  createdBy: UserObject | undefined;
  members: UserObject[];
  groupExpenses: TransactionType[];
  totalExpense: number;
  category: string;
}

interface StoreState {
  // Loading State
  loading: boolean;
  setLoading: (loading: boolean) => void;

  // Snackbar
  showSnackbar: (message: string) => void;
  // Pick Image
  pickImage: (
    setImage: React.Dispatch<React.SetStateAction<string | undefined | null>>,
  ) => void;

  handleFetchData: (navigation: NavigationProp<any>) => void;
}

export const Store = create<StoreState>(set => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),

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

  handleFetchData: async navigation => {
    set({ loading: true });

    try {
      const [userDataResponse, _, __] = await Promise.all([
        axios.post("/user/getUser", {
          token: await AsyncStorage.getItem("token"),
        }),
        TransactionStore.getState().fetchTransactions(),
        GroupStore.getState().handleFetchGroups(),
      ]);
      const userData = userDataResponse.data.userObject;

      UserStore.setState({ userObject: userData });
      UserStore.setState({ totalBalance: Number(userData.totalBalance) });
      UserStore.setState({ totalIncome: Number(userData.totalIncome) });
      UserStore.setState({ totalExpense: Number(userData.totalExpense) });
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
}));
