import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import HomePage from './src/pages/HomePage';
import SplashScreen from './src/pages/SplashScreenPage';

export default function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaView style={styles.main}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    height: "100%",
    backgroundColor: "#111",
  }
});
