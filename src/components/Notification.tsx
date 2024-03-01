import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Store } from '../store/store'
import { NavigationProp } from '@react-navigation/native'
import socket from '../utils/socket'

type propsType = {
  requestId: string,
  groupName: string,
  groupId: string,
  navigation: NavigationProp<any>;
}

export default function Notification({ requestId, groupName, groupId, navigation }: propsType) {
  const store = Store();

  return (
    <View style={styles.notification}>
      <Image
        source={require("../assets/defaultGroup.png")}
        style={styles.defaultGroupPhoto}
      />
      <Text style={styles.message}>
        You've been invited to join {groupName}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            store.handleRequest("accept", requestId, groupId, navigation)
          }}
        >
          <Image
            style={styles.button}
            source={require("../assets/accept.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => store.handleRequest("reject", requestId, groupId, navigation)}
        >
          <Image
            style={styles.button}
            source={require("../assets/reject.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  notification: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#666",
    paddingBottom: 20,
    marginBottom: 20
  },
  groupPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  defaultGroupPhoto: {
    width: 60,
    height: 60,
  },
  message: {
    textAlign: "center",
    maxWidth: "60%",
    color: "#000",
    fontSize: 18,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  button: {
    width: 30,
    height: 30
  }
})