import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import HomePage from './src/pages/HomePage';
import SplashScreen from './src/pages/SplashScreenPage';
import WelcomePage from './src/pages/WelcomePage';
import RegisterPage from './src/pages/RegisterPage';
import LoginPage from './src/pages/LoginPage';

export default function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaView style={styles.main}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Splash'
          screenOptions={{ headerShown: false, presentation: "modal", animation: "fade_from_bottom" }}
        >
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomePage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="Login" component={LoginPage} />
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
