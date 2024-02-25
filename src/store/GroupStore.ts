import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { create } from "zustand";
import { TransactionType } from "./TransactionStore";
import { UserObject, UserStore } from "./UserStore";
import { Store } from "./Store";

export interface Group {
  groupName: string;
  groupProfile?: string | undefined;
  createdBy: UserObject | undefined;
  members: UserObject[];
  groupExpenses: TransactionType[];
  totalExpense: number;
  category: string;
}

interface GroupState {
  // Group State
  groups: Group[] | [];
  setGroups: (groups: Group[]) => void;
  // Create Group
  handleCreateGroup: (
    title: string,
    selectedImage: string | undefined | null,
    navigation: NavigationProp<any>,
  ) => void;
  // FetchGroups
  handleFetchGroups: () => void;
}

export const GroupStore = create<GroupState>(set => ({
  groups: [],
  setGroups: groups => set({ groups }),

  handleCreateGroup: async (title, selectedImage, navigation) => {
    if (!title.trim()) {
      Store.getState().showSnackbar("Title is required");
      return;
    }

    Store.setState({ loading: true });
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
        // Add Group to store
        const newGroup: Group = {
          groupName: title,
          groupProfile: selectedImage ? selectedImage : undefined,
          createdBy: UserStore.getState().userObject,
          members: [],
          groupExpenses: [],
          totalExpense: 0,
          category: "NONE",
        };
        set({ groups: [...GroupStore.getState().groups, newGroup] });
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

  handleFetchGroups: async () => {
    const token = await AsyncStorage.getItem("token");
    Store.setState({ loading: true });

    axios
      .post("/group/getAll", { token })
      .then(res => {
        set({ groups: res.data.groups });
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
