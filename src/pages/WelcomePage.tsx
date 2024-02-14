import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import GradientText from '../components/GradientText'
import GradientButton from '../components/GradientButton'
import { NavigationProp } from '@react-navigation/native'

type propsType = {
  navigation: NavigationProp<any>;
}

export default function WelcomePage({ navigation }: propsType): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Image
        style={styles.welcomeImage}
        source={require("../assets/welcomePageImage.jpg")}
      />
      <Text style={styles.mainHeading}>Know where your money goes</Text>
      <Text style={styles.subHeading}>
        Track your transaction easily with categories and financial report
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => { navigation.navigate("Register") }}
        >
          <GradientButton text='register' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => { navigation.navigate("Login") }}
        >
          <GradientText text='login' style={styles.gradientText} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "#fff",
    height: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  welcomeImage: {
    height: "30%",
    width: "100%"
  },
  mainHeading: {
    textAlign: "center",
    color: "#000",
    fontSize: 30,
    paddingVertical: 5,
    width: "80%"
  },
  subHeading: {
    textAlign: "center",
    fontSize: 16,
    color: "#9D9D9D",
    paddingVertical: 5,
    width: "70%"
  },
  buttonContainer: {
    paddingTop: 70,
    paddingBottom: 30
  },
  registerButton: {
    borderRadius: 50,
    overflow: "hidden"
  },
  registerText: {
    color: "#fff",
    textAlign: 'center',
    fontSize: 30,
    textTransform: "uppercase",
    fontFamily: "Montserrat-Bold",
    letterSpacing: 5
  },
  loginButton: {
    backgroundColor: "#dfdfdf",
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginVertical: 30
  },
  gradientText: {
    textAlign: 'center',
    fontSize: 30,
    textTransform: "uppercase",
    fontFamily: "Montserrat-Bold",
    letterSpacing: 5
  }
})