import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Balance from '../components/Balance';
import Loading from '../components/Loading';
import MenuBar from '../components/MenuBar';
import TransactionSection from '../components/TransactionHome';
import { Store } from '../store/store';
import { MotiView } from 'moti';
import socket from '../utils/socket';

type propsType = {
  navigation: NavigationProp<any>
}

export default function HomePage({ navigation }: propsType): React.JSX.Element {
  const store = Store()
  const [profileClicked, setProfileClicked] = useState<boolean>(false);

  return (
    <>
      {store.loading ? <Loading /> : (
        <View style={[styles.container]}>
          <View style={styles.headingContainer}>
            <MotiView
              from={{
                opacity: 0.1,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                type: "timing"
              }}
              style={styles.userContainer}
            >
              <Pressable onPress={() => setProfileClicked(!profileClicked)}>
                {
                  store.userObject?.profilePicture ? (
                    <Image
                      style={styles.userProfileImage}
                      source={{ uri: store.userObject.profilePicture }}
                    />
                  ) : (
                    <Image
                      style={styles.userProfileImage}
                      source={require("../assets/defaultUser.png")}
                    />
                  )
                }
              </Pressable>
              {profileClicked &&
                <Modal visible={profileClicked} transparent={true}>
                  <Pressable onPress={() => setProfileClicked(!profileClicked)} style={styles.modalContainer}>
                    <MotiView
                      style={styles.shape}
                      from={{
                        opacity: 0,
                        scale: 0.5,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        type: 'timing',
                      }}
                    >
                      {store.userObject?.profilePicture ?
                        <Image
                          source={{ uri: store.userObject?.profilePicture }}
                          style={styles.modalImage}
                        />
                        :
                        <Image
                          source={require("../assets/defaultUser.png")}
                          style={styles.modalImage}
                        />
                      }
                    </MotiView>
                  </Pressable>
                </Modal>
              }
              <View>
                <Text style={styles.userName}>Welcome,</Text>
                <Text style={styles.userName}>{store.userObject?.userName.toLowerCase()}</Text>
              </View>
            </MotiView>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate("Notifications")}
            >
              {store.notifications.length > 0 ? (
                <Image
                  source={require("../assets/notification.png")}
                  style={styles.notificationIcon}
                />
              ) : (
                <Image
                  source={require("../assets/noNotification.png")}
                  style={styles.notificationIcon}
                />
              )}
            </TouchableOpacity>
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
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20
  },
  notificationButton: {
    width: 50,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  notificationIcon: {
    width: 30,
    height: 30
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  welcomeLogo: {
    height: 100,
    width: 100
  },
  userName: {
    color: "#222",
    fontSize: 20,
    fontFamily: "Montserrat-SemiBold"
  },
  userProfileImage: {
    height: 70,
    width: 70,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#222"
  },
  modalContainer: {
    display: "flex",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center"
  },
  shape: {
    justifyContent: 'center',
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'contain',
    height: "100%",
    width: "100%"
  },
  modalImage: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },

})