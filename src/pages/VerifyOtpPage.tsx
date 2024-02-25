import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import GradientButton from '../components/GradientButton';
import { AuthenticationStore } from '../store/AuthenticationStore';
import { Store } from '../store/Store';

type propsType = {
  navigation: NavigationProp<any>
}

export default function VerifyOtpPage({ navigation }: propsType): React.JSX.Element {
  const [otp, setOtp] = useState('');
  const authStore = AuthenticationStore()
  const store = Store();

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      return;
    }

    store.setLoading(true)
    const otpId = await AsyncStorage.getItem("otpId");

    axios.post('/user/verifyOtp', { userOtp: otp, otpId })
      .then(async () => {
        if (authStore.isAuthenticatedChange === false) {
          navigation.navigate("ResetPassword")
          store.showSnackbar("Create a new Password")
        } else {
          authStore.handleResetPassword(authStore.password, navigation);
          navigation.navigate("Account")
          authStore.setPassword("");
          await AsyncStorage.removeItem("resetEmail")
        }
      })
      .catch((err) => {
        console.log(err);
        store.showSnackbar(err.response.data.message)
      })
      .finally(() => {
        store.setLoading(false)
      })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Verify OTP</Text>
      <Text style={styles.mainInstruction}>
        One Time Password (OTP) has been sent via mail to you email
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
        maxLength={6}
        placeholderTextColor="#999"
      />
      {store.loading ? (
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => store.showSnackbar("Logging In..")}
        >
          <GradientButton text='verify' />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => handleVerifyOtp()}
        >
          <GradientButton text='verify' />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    color: "#222",
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 20,
    letterSpacing: 5
  },
  mainInstruction: {
    textAlign: "center",
    fontSize: 18,
    color: "#222",
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
    color: "#222",
    fontSize: 30,
    letterSpacing: 5,
    textAlign: "center"
  },
  verifyButton: {
    borderRadius: 50,
    overflow: "hidden"
  },
});
