import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import GradientButton from '../components/GradientButton';
import Input from '../components/TextInput';
import { userStore } from '../store/userStore';

type propsType = {
  navigation: NavigationProp<any>
}

export default function RegisterPage({ navigation }: propsType): React.JSX.Element {
  const [selectedImage, setSelectedImage] = useState<string | undefined | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const store = userStore()

  async function handleRegister() {
    if (!email.trim() || !userName.trim() || !password.trim()) {
      store.showToastWithGravityAndOffset("Enter all Credentials")
      return
    }

    store.setLoading(true)
    store.showToastWithGravityAndOffset("Sending Verification Mail..")

    axios.post("/user/sendVerifyEmail", {
      email: email.toLowerCase(),
      userName: userName.toLowerCase(),
      password,
      selectedImage
    })
      .then(async (res) => {
        await AsyncStorage.setItem("otpId", res.data.otpId);
        await AsyncStorage.setItem("userDataId", res.data.userDataId);
        userStore.getState().showToastWithGravityAndOffset(res.data.message)
        navigation.navigate("VerifyEmail");
      })
      .catch((err) => {
        userStore.getState().showToastWithGravityAndOffset(err.response.data.message)
      })
      .finally(async () => {
        store.setLoading(false)
        if (selectedImage) {
          await AsyncStorage.setItem("selectedImage", selectedImage);
        }
      })
  }

  return (
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
                source={require("../assets/profile.png")}
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
          placeholder='Password'
          secureTextEntry={true}
        />
        {store.loading ? (
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => store.showToastWithGravityAndOffset("Creating Account..")}
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
    color: "#000",
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