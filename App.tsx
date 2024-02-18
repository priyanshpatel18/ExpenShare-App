import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ForgotPage from './src/pages/ForgotPage';
import GroupPage from './src/pages/GroupPage';
import HomePage from './src/pages/HomePage';
import LoginPage from './src/pages/LoginPage';
import RegisterPage from './src/pages/RegisterPage';
import ResetPasswordPage from './src/pages/ResetPasswordPage';
import SplashScreen from './src/pages/SplashScreenPage';
import TransactionPage from './src/pages/TransactionPage';
import UserPage from './src/pages/UserPage';
import VerifyEmailPage from './src/pages/VerifyEmailPage';
import VerifyOtpPage from './src/pages/VerifyOtpPage';
import WelcomePage from './src/pages/WelcomePage';
import AddPage from './src/pages/AddPage';
import CategoriesPage from './src/pages/CategoriesPage';

axios.defaults.baseURL = "http://192.168.114.48:5555"
axios.defaults.withCredentials = true

export default function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaView style={styles.main}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Splash'
          screenOptions={{ headerShown: false, presentation: "modal", animation: "fade", animationDuration: 1000 }}
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
          <Stack.Screen name="AddTransaction" component={AddPage} options={{ animation: "slide_from_bottom" }} />
          <Stack.Screen name="Categories" component={CategoriesPage} options={{ animation: "slide_from_bottom", animationDuration: 2000 }} />
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
