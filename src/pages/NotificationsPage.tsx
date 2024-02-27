import { NavigationProp } from '@react-navigation/native';
import { ScrollView } from 'moti';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Store } from '../store/store';
import Notification from '../components/Notification';

type propsType = {
  navigation: NavigationProp<any>;
}

export default function NotificationsPage({ navigation }: propsType) {
  const store = Store()

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require("../assets/backButton.png")}
          style={styles.backButton}
        />
      </TouchableOpacity>
      <Text style={styles.headingText}>Notifications</Text>
      {store.notifications ? (
        <ScrollView style={styles.notificationContainer}>
          {store.notifications.map((notification, index) => {
            return (
              <Notification
                key={index}
                requestId={notification.requestId}
                groupName={notification.groupName}
                groupId={notification.groupId}
                navigation={navigation}
              />
            )
          })}
        </ScrollView>
      ) :
        <>

        </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: "100%",
    padding: 20,
  },
  backButton: {
    height: 40,
    width: 40,
    marginBottom: 20,
  },
  headingText: {
    color: "#000",
    position: "absolute",
    top: 20,
    fontSize: 25,
    textAlign: "center",
    textTransform: "uppercase",
    alignSelf: "center",
    fontFamily: "Montserrat-Bold"
  },
  notificationContainer: {

  },

})