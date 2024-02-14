import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ForgotPage from './src/pages/ForgotPage';
import HomePage from './src/pages/HomePage';
import LoginPage from './src/pages/LoginPage';
import RegisterPage from './src/pages/RegisterPage';
import ResetPasswordPage from './src/pages/ResetPasswordPage';
import SplashScreen from './src/pages/SplashScreenPage';
import VerifyEmailPage from './src/pages/VerifyEmailPage';
import VerifyOtpPage from './src/pages/VerifyOtpPage';
import WelcomePage from './src/pages/WelcomePage';
import TransactionPage from './src/pages/TransactionPage';
import GroupPage from './src/pages/GroupPage';
import UserPage from './src/pages/UserPage';

axios.defaults.baseURL = "http://192.168.249.23:8080"
axios.defaults.withCredentials = true

export default function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaView style={styles.main}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Splash'
          screenOptions={{ headerShown: false, presentation: "modal", animation: "slide_from_right" }}
        >
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: "fade_from_bottom" }} />
          <Stack.Screen name="Welcome" component={WelcomePage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Forgot" component={ForgotPage} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtpPage} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailPage} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordPage} />
          <Stack.Screen name="Transaction" component={TransactionPage} />
          <Stack.Screen name="Group" component={GroupPage} />
          <Stack.Screen name="User" component={UserPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    height: "100%",
    backgroundColor: "#e6e6e6",
    fontFamily: "Montserrat"
  }
});
