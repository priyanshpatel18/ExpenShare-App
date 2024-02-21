import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationProp } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Store } from '../store/store'
import axios from 'axios'

type propsType = {
  navigation: NavigationProp<any>
}

export default function AccountPage({ navigation }: propsType): React.JSX.Element {
  const store = Store();
  const [textInput, setTextInput] = useState<string>(String(store.userObject?.userName));
  const [profilePicture, setProfilePicture] = useState<string | undefined | null>(String(store.userObject?.profilePicture))
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  async function handleSave() {
    if (textInput.trim() === store.userObject?.userName && profilePicture === store.userObject.profilePicture) {
      store.showToastWithGravityAndOffset("No Changes");
      navigation.goBack();
      return;
    }
    const formData = new FormData();

    formData.append("token", await AsyncStorage.getItem("token"));
    if (textInput !== store.userObject?.userName) {
      formData.append("userName", textInput);
    }
    if (profilePicture !== store.userObject?.profilePicture) {
      const extension = profilePicture?.split(".").pop();
      formData.append("profilePicture", {
        uri: profilePicture,
        name: `profilePicture.${extension}`,
        type: `image/${extension}`
      })
    }
    Store.getState().showToastWithGravityAndOffset("Updating...")

    store.setLoading(true)
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
        Store.getState().showToastWithGravityAndOffset(res.data.message);
      })
      .catch((err) => {
        Store.getState().showToastWithGravityAndOffset(err.response.data.message)
      })
      .finally(() => {
        store.setLoading(false);
        navigation.goBack();
      })
  }

  async function handleChange() {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      store.showToastWithGravityAndOffset("Enter Both Passwords");
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

      store.showToastWithGravityAndOffset(message);
      return;
    }

    store.setIsAuthenticatedChange(true);
    store.setPassword(newPassword);
    await AsyncStorage.setItem("resetEmail", String(store.userObject?.email));
    store.handleSendMail(String(store.userObject?.email), navigation)
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 30 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.headingButton}
              source={require("../assets/backButton.png")}
            />
          </TouchableOpacity>
          <Text style={styles.headingText}>Account</Text>
        </View>
        {store.loading ?
          <TouchableOpacity onPress={() => Store.getState().showToastWithGravityAndOffset("Updating...")}>
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
        <TouchableWithoutFeedback onPress={() => store.pickImage(setProfilePicture)}>
          <View>
            {profilePicture ?
              <Image
                style={styles.profilePicture}
                source={{ uri: profilePicture }}
              />
              :
              <Image
                style={styles.profilePicture}
                source={{ uri: "https://res.cloudinary.com/dsl326wbi/image/upload/v1707911640/profile_m7bx7w.png" }}
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
        {store.loading ?
          <TouchableOpacity style={styles.changeButton} onPress={() => store.showToastWithGravityAndOffset("Sending Mail...")}>
            <Text style={styles.changeText}>Change Password</Text>
          </TouchableOpacity> :
          <TouchableOpacity style={styles.changeButton} onPress={handleChange}>
            <Text style={styles.changeText}>Change Password</Text>
          </TouchableOpacity>
        }
      </View>
      <TouchableOpacity style={[styles.changeButton, { backgroundColor: "#ff4545" }]}>
        <Text style={styles.changeText}>Delete your account</Text>
      </TouchableOpacity>
    </View>
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
    color: "#000",
    fontSize: 30,
    fontFamily: "Montserrat-SemiBold",
  },
  detailContainer: {
    flexDirection: "row",
    gap: 50,
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  profilePicture: {
    height: 80,
    width: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#000"
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
  },
  changeText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Montserrat-Bold",
    textTransform: "uppercase"
  }
})