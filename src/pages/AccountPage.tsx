import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationProp } from '@react-navigation/native'
import axios from 'axios'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import RNFS from "react-native-fs"
import Loading from '../components/Loading'
import { AuthenticationStore } from '../store/AuthenticationStore'
import { Store } from '../store/Store'
import { UserStore } from '../store/UserStore'

type propsType = {
  navigation: NavigationProp<any>
}

export default function AccountPage({ navigation }: propsType): React.JSX.Element {
  const commonStore = Store();
  const store = UserStore();
  const [textInput, setTextInput] = useState<string>(String(store.userObject?.userName));
  const [profilePicture, setProfilePicture] = useState<string | undefined | null>(String(store.userObject?.profilePicture))
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  async function handleSave() {
    if (textInput.trim() === store.userObject?.userName && profilePicture === store.userObject.profilePicture) {
      commonStore.showSnackbar("No Changes");
      navigation.goBack();
      return;
    }

    if (textInput !== store.userObject?.userName && /\s/.test(textInput)) {
      commonStore.showSnackbar("Username cannot contain spaces");
      return;
    }

    if (textInput !== store.userObject?.userName && textInput.length > 15) {
      commonStore.showSnackbar("Username must be 15 characters long");
      return;
    }

    if (profilePicture !== store.userObject?.profilePicture) {
      const fileInfo = await RNFS.stat(String(profilePicture));
      const fileSizeInBytes = fileInfo.size;
      const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
      if (fileSizeInMegabytes > 3) {
        commonStore.showSnackbar("File Size must be less than 3MB")
        return;
      }
    }

    const formData = new FormData();

    formData.append("token", await AsyncStorage.getItem("token"));
    if (textInput !== store.userObject?.userName) {
      formData.append("userName", textInput.toLowerCase());
    }
    if (profilePicture !== store.userObject?.profilePicture) {
      const extension = profilePicture?.split(".").pop();
      formData.append("profilePicture", {
        uri: profilePicture,
        name: `profilePicture.${extension}`,
        type: `image/${extension}`
      })
    }

    Store.getState().showSnackbar("Updating...")

    commonStore.setLoading(true)
    axios.post("/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        store.setUserObject({
          userName: textInput,
          email: store.userObject?.email || '',
          profilePicture: res.data.profileUrl || String(store.userObject?.profilePicture),
          totalBalance: store.userObject?.totalBalance,
          totalIncome: store.userObject?.totalIncome,
          totalExpense: store.userObject?.totalExpense
        });
        Store.getState().showSnackbar(res.data.message);
      })
      .catch((err) => {
        Store.getState().showSnackbar(err.response.data.message)
      })
      .finally(() => {
        commonStore.setLoading(false);
        navigation.goBack();
      })
  }

  async function handleChange() {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      commonStore.showSnackbar("Enter Both Passwords");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      let message = "";

      if (!/(?=.*[a-z])/.test(newPassword)) {
        message = "Password should contain at least one lowercase";
      } else if (!/(?=.*[A-Z])/.test(newPassword)) {
        message = "Password should contain at least one uppercase";
      } else if (!/(?=.*\d)/.test(newPassword)) {
        message = "Password should contain at least one number";
      } else if (!/(?=.*[@$!%*?&])/.test(newPassword)) {
        message = "Password should contain at least one special character";
      } else if (newPassword.length < 6) {
        message = "Password should be minimum 8 characters";
      } else if (newPassword !== confirmPassword) {
        message = "Passwords don't match";
      }

      commonStore.showSnackbar(message);
      return;
    }

    AuthenticationStore.setState({ isAuthenticatedChange: true });
    AuthenticationStore.getState().setPassword(newPassword);
    await AsyncStorage.setItem("resetEmail", String(store.userObject?.email));
    AuthenticationStore.getState().handleSendMail(String(store.userObject?.email), navigation)
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <>
      {commonStore.loading ? <Loading />
        : (
          <View style={styles.container}>
            <View style={styles.headingContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  style={styles.headingButton}
                  source={require("../assets/backButton.png")}
                />
              </TouchableOpacity>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 30 }}>
                <Text style={styles.headingText}>Account</Text>
              </View>
              {commonStore.loading ?
                <TouchableOpacity onPress={() => Store.getState().showSnackbar("Updating...")}>
                  <Image
                    style={styles.headingButton}
                    source={require("../assets/doneButton.png")}
                  />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={handleSave}>
                  <Image
                    style={styles.headingButton}
                    source={require("../assets/doneButton.png")}
                  />
                </TouchableOpacity>
              }
            </View>
            <View style={styles.detailContainer}>
              <TouchableWithoutFeedback onPress={() => commonStore.pickImage(setProfilePicture)}>
                <View>
                  {profilePicture ?
                    <Image
                      style={styles.profilePicture}
                      source={{ uri: profilePicture }}
                    />
                    :
                    <Image
                      style={styles.profilePicture}
                      source={require("../assets/defaultUser.png")}
                    />
                  }
                  <Image
                    style={styles.addIcon}
                    source={require("../assets/addIcon.png")}
                  />
                </View>
              </TouchableWithoutFeedback>
              <View>
                <Text style={styles.subHeading}>Username</Text>
                <TextInput
                  value={textInput}
                  style={[styles.propertyValue, { padding: 0 }]}
                  onChangeText={(text: string) => setTextInput(text)}
                  placeholderTextColor="#111"
                />
              </View>
            </View>
            <View>
              <Text style={styles.subHeading}>email</Text>
              <Text style={styles.propertyValue}>{store.userObject?.email}</Text>
            </View>
            <View style={styles.passwordContainer}>
              <Text style={[styles.subHeading, { marginTop: 20, fontSize: 22 }]}>password change</Text>
              <Text style={styles.infoText}>Leave Passwords Empty, when you don't want to change it</Text>
              <TextInput
                value={newPassword}
                onChangeText={(password: string) => setNewPassword(password)}
                style={[styles.propertyValue, styles.passwordInput]}
                placeholder='Password'
                placeholderTextColor="#888"
                keyboardType='default'
                secureTextEntry={true}
              />
              <TextInput
                value={confirmPassword}
                onChangeText={(password: string) => setConfirmPassword(password)}
                style={[styles.passwordInput, styles.propertyValue]}
                placeholder='Confirm Password'
                placeholderTextColor="#888"
                keyboardType='default'
                secureTextEntry={true}
              />
              {commonStore.loading ?
                <TouchableOpacity style={styles.changeButton} onPress={() => commonStore.showSnackbar("Sending Mail...")}>
                  <Text style={styles.changeText}>Change Password</Text>
                </TouchableOpacity> :
                <TouchableOpacity style={styles.changeButton} onPress={handleChange}>
                  <Text style={styles.changeText}>Change Password</Text>
                </TouchableOpacity>
              }
            </View>
            <TouchableOpacity style={[styles.changeButton, { backgroundColor: "#ff4545" }]}>
              <Image
                source={require("../assets/dustbin.png")}
                style={styles.deleteIcon}
              />
              <Text style={styles.changeText}>Delete your account</Text>
            </TouchableOpacity>
          </View>
        )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
    padding: 20
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headingButton: {
    height: 40,
    width: 40,
  },
  headingText: {
    color: "#222",
    fontSize: 30,
    fontFamily: "Montserrat-SemiBold",
  },
  detailContainer: {
    flexDirection: "row",
    gap: 30,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center"
  },
  profilePicture: {
    height: 80,
    width: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#222"
  },
  addIcon: {
    backgroundColor: "#f00",
    height: 25,
    width: 25,
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -3,
    right: -3,
  },
  propertyValue: {
    color: "#111",
    fontSize: 22,
    fontFamily: "Montserrat-SemiBold",
  },
  passwordContainer: {
    marginVertical: 20,
    borderTopWidth: 2,
    borderTopColor: "#777",
    borderBottomWidth: 2,
    borderBottomColor: "#777",
  },
  subHeading: {
    fontSize: 15,
    textTransform: "uppercase",
    color: "#666",
    fontFamily: "Montserrat-SemiBold",
  },
  infoText: {
    color: "#888",
    fontStyle: "italic",
    fontFamily: "Montserrat-Regular",
  },
  passwordInput: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
    fontSize: 22,
    fontFamily: "Montserrat-SemiBold",
  },
  changeButton: {
    marginTop: 15,
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#58B9E6",
    borderRadius: 10,
    marginBottom: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  changeText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Montserrat-SemiBold",
  },
  deleteIcon: {
    width: 30,
    height: 30
  }
})