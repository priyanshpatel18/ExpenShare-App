import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GradientButton from '../components/GradientButton';
import Input from '../components/TextInput';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userStore } from '../store/userStore';

type propsType = {
  navigation: NavigationProp<any>
}

export default function ForgotPage({ navigation }: propsType): React.JSX.Element {
  const [email, setEmail] = useState<string>("");

  function handleSendMail() {
    if (!email) {
      userStore.getState().showToastWithGravityAndOffset("Enter the Email")
      return;
    }

    userStore.getState().showToastWithGravityAndOffset("Sending Mail..")
    axios.post("/user/sendMail", { email })
      .then(async (res) => {
        userStore.getState().showToastWithGravityAndOffset(res.data.message)
        await AsyncStorage.setItem("otpId", res.data.otpId);
        navigation.navigate("VerifyOtp")
      })
      .catch((err) => {
        console.log(err);
        userStore.getState().showToastWithGravityAndOffset(err.response.data.message)
      })
      .finally(() => {
        userStore.setState({ loading: false })
      })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>forgot password?</Text>
      <Text style={styles.subHeading}>
        That's no fun. Enter your email and we'll send you instructions to reset your password.
      </Text>
      <View style={styles.formContainer}>
        <Input
          imageUrl={require("../assets/email.png")}
          value={email}
          setValue={setEmail}
          keyboardType='email-address'
          placeholder='Email Address'
          secureTextEntry={false}
        />
        {userStore.getState().loading ? (
          <TouchableOpacity
            style={styles.sendMailButton}
            onPress={() => userStore.getState().showToastWithGravityAndOffset("Sending Mail..")}
          >
            <GradientButton text='send mail' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.sendMailButton}
            onPress={() => handleSendMail()}
          >
            <GradientButton text='send mail' />
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
  headingText: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  subHeading: {
    textAlign: "center",
    fontSize: 15,
    color: "#9D9D9D",
    paddingVertical: 5,
    width: "85%"
  },
  formContainer: {
    width: "80%",
    marginVertical: 10
  },
  sendMailButton: {
    borderRadius: 50,
    overflow: "hidden"
  },
  disabledButton: {
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  }
})