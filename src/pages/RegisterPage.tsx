import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import GradientButton from '../components/GradientButton';
import Input from '../components/TextInput';
import { Store } from '../store/store';
import Loading from '../components/Loading';

type propsType = {
  navigation: NavigationProp<any>
}

export default function RegisterPage({ navigation }: propsType): React.JSX.Element {
  const [selectedImage, setSelectedImage] = useState<string | undefined | null>();
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const store = Store()

  async function handleRegister() {
    if (!email.trim() || !userName.trim() || !password.trim()) {
      store.showSnackbar("Enter all Credentials")
      return
    }

    if (/\s/.test(email)) {
      store.showSnackbar("Email cannot contain spaces");
      return;
    }

    if (/\s/.test(userName)) {
      store.showSnackbar("Username cannot contain spaces");
      return;
    }

    if (userName.length > 15) {
      store.showSnackbar("Username should be max 15 characters");
      return;
    }

    if (!/^\S*$/.test(password)) {
      store.showSnackbar("Password cannot contain spaces");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;

    if (!passwordRegex.test(password)) {
      let message = "";

      if (!/(?=.*[a-z])/.test(password)) {
        message = "Password should contain at least one lowercase";
      } else if (!/(?=.*[A-Z])/.test(password)) {
        message = "Password should contain at least one uppercase";
      } else if (!/(?=.*\d)/.test(password)) {
        message = "Password should contain at least one number";
      } else if (!/(?=.*[@$!%*?&])/.test(password)) {
        message = "Password should contain at least one special character";
      } else if (password.length < 6) {
        message = "Password should be minimum 6 characters";
      }

      store.showSnackbar(message);
      return;
    }

    store.setLoading(true)
    store.showSnackbar("Sending Verification Mail..")

    axios.post("/user/sendVerifyEmail", {
      email: email.toLowerCase(),
      userName: userName.toLowerCase(),
      password,
      selectedImage
    })
      .then(async (res) => {
        await AsyncStorage.setItem("otpId", res.data.otpId);
        await AsyncStorage.setItem("userDataId", res.data.userDataId);
        Store.getState().showSnackbar(res.data.message)
        navigation.navigate("VerifyEmail");
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          Store.getState().showSnackbar(err.response?.data.message)
        } else {
          console.log(err)
        }
      })
      .finally(async () => {
        store.setLoading(false)
        if (selectedImage) {
          await AsyncStorage.setItem("selectedImage", selectedImage);
        }
      })
  }

  return (
    store.loading ? <Loading /> :
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/APP-LOGO.png")}
        />
        <Text style={styles.headingText}>register</Text>
        <View style={styles.formContainer}>
          <TouchableWithoutFeedback
            onPress={() => store.pickImage(setSelectedImage)}
          >
            <View style={styles.imageContainer}>
              {selectedImage ? (
                <Image
                  style={styles.profileImage}
                  source={{ uri: selectedImage }}
                />
              ) : (
                <Image
                  style={styles.profileImage}
                  source={require("../assets/defaultUser.png")}
                />
              )}
              <View style={styles.addIconContainer}>
                <Text style={styles.addIcon}>+</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <Input
            imageUrl={require("../assets/username.png")}
            value={userName}
            setValue={setUserName}
            keyboardType='default'
            placeholder='Username'
            secureTextEntry={false}
          />
          <Input
            imageUrl={require("../assets/email.png")}
            value={email}
            setValue={setEmail}
            keyboardType='email-address'
            placeholder='Email address'
            secureTextEntry={false}
          />
          <Input
            imageUrl={require("../assets/password.png")}
            value={password}
            setValue={setPassword}
            keyboardType='default'
            secureTextEntry={true}
            placeholder='Password'
          />
          {store.loading ? (
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => store.showSnackbar("Creating Account..")}
            >
              <GradientButton text='register' />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => handleRegister()}
            >
              <GradientButton text='register' />
            </TouchableOpacity>
          )}
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 10
  },
  logo: {
    height: 100,
    width: 100,
    marginBottom: 20,
  },
  headingText: {
    color: "#222",
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 20,
    letterSpacing: 5
  },
  formContainer: {
    width: "85%",
  },
  inputContainer: {
    backgroundColor: "#dfdfdf",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#ccc",
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 30,
    alignSelf: "center"
  },
  addIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#f00",
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    position: "absolute",
    fontSize: 25,
    color: "#fff",
  },
  profileImage: {
    height: 90,
    width: 90,
    borderRadius: 50,
  },
  registerButton: {
    borderRadius: 50,
    overflow: "hidden"
  }
})