import { BackHandler, ToastAndroid } from "react-native";
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from "react-native-image-picker";
import { create } from "zustand";

interface UserStoreState {
  loading: boolean;
  showToastWithGravityAndOffset: (message: string) => void;

  pickImage: (
    setSelectedImage: React.Dispatch<
      React.SetStateAction<string | null | undefined>
    >,
  ) => void;
}

export const userStore = create<UserStoreState>(set => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),

  showToastWithGravityAndOffset: (message: string) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  },

  pickImage: setSelectedImage => {
    let options: ImageLibraryOptions = {
      mediaType: "photo",
      maxWidth: 200,
      maxHeight: 200,
    };

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const image = response.assets[0].uri;
        setSelectedImage(image);
      }
    });
  },
}));
