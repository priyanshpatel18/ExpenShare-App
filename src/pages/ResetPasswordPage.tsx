import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GradientButton from '../components/GradientButton';
import Input from '../components/TextInput';
import { Store } from '../store/store';

type propsType = {
  navigation: NavigationProp<any>
}

export default function ResetPasswordPage({ navigation }: propsType): React.JSX.Element {
  const store = Store();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Reset password</Text>
      <View style={styles.formContainer}>
        <Input
          imageUrl={require("../assets/password.png")}
          value={password}
          setValue={setPassword}
          keyboardType='default'
          placeholder='New Password'
          secureTextEntry={true}
        />
        <Input
          imageUrl={require("../assets/password.png")}
          value={confirmPassword}
          setValue={setConfirmPassword}
          keyboardType='default'
          placeholder='Confirm Password'
          secureTextEntry={true}
        />
        {store.loading ? (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => store.showToastWithGravityAndOffset("Verifying Email...")}
          >
            <GradientButton text='reset' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              store.handleResetPassword(password, navigation, confirmPassword)
            }}
          >
            <GradientButton text='reset' />
          </TouchableOpacity>
        )
        }
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
    color: "#222",
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 20,
    letterSpacing: 3
  },
  formContainer: {
    width: "85%",
  },
  resetButton: {
    borderRadius: 50,
    overflow: "hidden"
  }
})