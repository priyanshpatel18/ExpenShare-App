import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { userStore } from '../store/userStore';

import GradientButton from '../components/GradientButton';

type propsType = {
  navigation: NavigationProp<any>
}

export default function VerifyEmailPage({ navigation }: propsType) {
  const [otp, setOtp] = useState<string>('');
  const store = userStore();

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
      {store.loading ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => store.showToastWithGravityAndOffset("Creating Account...")}
        >
          <GradientButton text='verify' />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => store.handleVerifyEmail(otp, navigation)}>
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
