import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Balance from '../components/Balance';
import MenuBar from '../components/MenuBar';
import TransactionSection from '../components/TransactionHome';
import { Store } from '../store/store';

type propsType = {
  navigation: NavigationProp<any>
}

export default function HomePage({ navigation }: propsType): React.JSX.Element {
  const store = Store()

  useEffect(() => {
    const fetchData = async () => {
      store.setLoading(true)

      const token = await AsyncStorage.getItem("token")
      axios.post("/user/getUser", { token })
        .then((res) => {
          store.setUserObject(res.data.userObject);
          store.setTotalBalance(Number(res.data.userObject.totalBalance));
          store.setTotalExpense(Number(res.data.userObject.totalExpense));
          store.setTotalIncome(Number(res.data.userObject.totalIncome));
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        })
        .finally(() => {
          store.setLoading(false)
        })
    };

    fetchData();

  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        {
          store.userObject?.profilePicture ? (
            <Image
              style={styles.userProfileImage}
              source={{ uri: store.userObject.profilePicture }}
            />
          ) : (
            <Image
              style={styles.userProfileImage}
              source={{ uri: "https://res.cloudinary.com/dsl326wbi/image/upload/v1707911640/profile_m7bx7w.png" }}
            />
          )
        }
        <View>
          <Text style={styles.userName}>Welcome,</Text>
          <Text style={styles.userName}>{store.userObject?.userName}</Text>
        </View>
      </View>
      <Balance />
      <TransactionSection navigation={navigation} />
      <MenuBar navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    backgroundColor: "#fff"
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    padding: 20
  },
  welcomeLogo: {
    height: 100,
    width: 100
  },
  userName: {
    color: "#000",
    fontSize: 20,
    fontFamily: "Montserrat-SemiBold"
  },
  userProfileImage: {
    height: 70,
    width: 70,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#000"
  },
})