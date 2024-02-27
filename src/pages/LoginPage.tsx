import { NavigationProp } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import GradientButton from '../components/GradientButton'
import Input from '../components/TextInput'
import { Store } from '../store/store'

type propsType = {
  navigation: NavigationProp<any>
}

export default function LoginPage({ navigation }: propsType): React.JSX.Element {
  const store = Store();

  const [userNameOrEmail, setUserNameOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../assets/APP-LOGO.png")}
      />
      <Text style={styles.headingText}>Login</Text>
      <View style={styles.formContainer}>
        <Input
          imageUrl={require("../assets/email.png")}
          value={userNameOrEmail}
          setValue={setUserNameOrEmail}
          keyboardType='default'
          placeholder='Email or Username'
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
        <Text onPress={() => navigation.navigate("Forgot")} style={styles.forgotLink}>
          Forgot Password ?
        </Text>

        {store.loading ? (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => store.showSnackbar("Logging In..")}
          >
            <GradientButton text='login' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => { store.handleLogin(userNameOrEmail, password, navigation) }}
          >
            <GradientButton text='login' />
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
  loginButton: {
    borderRadius: 50,
    overflow: "hidden"
  },
  forgotLink: {
    color: "#539AEA",
    fontSize: 18,
    paddingHorizontal: 10,
    marginBottom: 30,
  }
});
