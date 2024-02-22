import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import Balance from '../components/Balance';
import MenuBar from '../components/MenuBar';
import TransactionSection from '../components/TransactionHome';
import { Store } from '../store/store';
import Loading from '../components/Loading';

type propsType = {
  navigation: NavigationProp<any>
}

export default function HomePage({ navigation }: propsType): React.JSX.Element {
  const store = Store()

  return (
    <>
      {store.loading ? <Loading /> : (
        <View style={[styles.container]}>
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
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
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
    color: Store.getState().mode === "light" ? "#222" : "#fff",
    fontSize: 20,
    fontFamily: "Montserrat-SemiBold"
  },
  userProfileImage: {
    height: 70,
    width: 70,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Store.getState().mode === "light" ? "#222" : "#fff"
  },
})