import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

type propsType = {
  navigation: NavigationProp<any>;
}

const SplashScreen = ({ navigation }: propsType): React.JSX.Element => {
  const scaleAnimation = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 700,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => {
      setTimeout(() => {
        navigation.navigate("Home")
      }, 100)
    })
  }, []);

  return (
    <View style={styles.splashScreen}>
      <Animated.Image
        style={[
          styles.splashLogo,
          {
            transform: [{ scale: scaleAnimation }]
          },
        ]}
        source={require("../../assets/APP-LOGO.png")}
      />
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  splashScreen: {
    backgroundColor: "#fff",
    minHeight: "100%",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  splashLogo: {
    height: "80%",
    width: "80%",
    resizeMode: "contain",
  },
});
