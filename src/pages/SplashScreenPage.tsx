import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Store } from '../store/store';
import axios from 'axios';

type propsType = {
  navigation: NavigationProp<any>;
}

const SplashScreen = ({ navigation }: propsType): React.JSX.Element => {
  const scaleAnimation = useRef(new Animated.Value(0.2)).current;
  const store = Store();

  useEffect(() => {
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 400,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(async () => {
      if (await AsyncStorage.getItem("token")) {
        // await AsyncStorage.removeItem("token");
        console.log(await AsyncStorage.getItem("token"));
        
        async function fetchData() {

          store.setLoading(true);
          try {
            const [userDataResponse, _] = await Promise.all([
              axios.post("/user/getUser", { token: await AsyncStorage.getItem("token") }),
              store.fetchTransactions()
            ]);
            const userData = userDataResponse.data.userObject;

            store.setUserObject(userData);
            store.setTotalBalance(Number(userData.totalBalance));
            store.setTotalExpense(Number(userData.totalExpense));
            store.setTotalIncome(Number(userData.totalIncome));
          } catch (error) {
            console.error("Error fetching data:", error);
          }
          finally {
            store.setLoading(false)
          }
        }

        fetchData();


        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        return;
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
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
        source={require("../assets/APP-LOGO.png")}
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
