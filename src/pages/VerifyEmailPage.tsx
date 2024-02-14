import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { userStore } from '../store/userStore';

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import GradientButton from '../components/GradientButton';

type propsType = {
  navigation: NavigationProp<any>
}

export default function VerifyEmailPage({ navigation }: propsType) {
  const [otp, setOtp] = useState<string>('');

  async function handleVerifyEmail() {
    userStore.setState({ loading: true });
    userStore.getState().showToastWithGravityAndOffset("Verifying Email..");

    if (!otp.trim()) {
      return;
    }
    const otpId = await AsyncStorage.getItem("otpId");

    axios
      .post("/user/verifyEmail", { userOtp: otp, otpId })
      .then(async res => {
        const formData = new FormData();
        formData.append("email", await AsyncStorage.getItem("email"));
        formData.append("userName", await AsyncStorage.getItem("userName"));
        formData.append("password", await AsyncStorage.getItem("password"));

        const selectedImage = await AsyncStorage.getItem("selectedImage");
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
          .post("/user/register", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(res => {
            navigation.navigate("Home");
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
            await AsyncStorage.removeItem("otpId");
            await AsyncStorage.removeItem("userName");
            await AsyncStorage.removeItem("password");
            await AsyncStorage.removeItem("profilePicture");
          });
      })
      .catch(err => {
        userStore
          .getState()
          .showToastWithGravityAndOffset(err.response.data.message);
      })
      .finally(async () => {
        userStore.setState({ loading: false });
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Verify Email</Text>
      <Text style={styles.mainInstruction}>
        One Time Password (OTP) has been sent via mail to your email
      </Text>
      <Text style={styles.subHeading}>
        Enter the OTP below to verify it.
      </Text>
      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
        placeholder="Enter OTP"
        keyboardType="numeric"
        placeholderTextColor="#999"
        maxLength={6}
      />
      {userStore.getState().loading ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => userStore.getState().showToastWithGravityAndOffset("Verifying Email...")}
        >
          <GradientButton text='verify' />
        </TouchableOpacity>
      ) : (

        <TouchableOpacity style={styles.button} onPress={() => handleVerifyEmail()}>
          <GradientButton text='verify' />
        </TouchableOpacity>
      )
      }
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 20,
    letterSpacing: 5
  },
  mainInstruction: {
    textAlign: "center",
    fontSize: 18,
    color: "#000",
    paddingVertical: 5,
    width: "80%"
  },
  subHeading: {
    textAlign: "center",
    fontSize: 18,
    color: "#111",
    paddingVertical: 5,
    width: "80%"
  },
  input: {
    width: '80%',
    height: 70,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: "#dfdfdf",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 30,
    color: "#000",
    fontSize: 30,
    letterSpacing: 5,
    textAlign: "center"
  },
  button: {
    borderRadius: 50,
    overflow: "hidden"
  },
});
