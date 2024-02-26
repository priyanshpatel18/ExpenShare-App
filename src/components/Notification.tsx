import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

type propsType = {
  requestId: string,
  groupName: string,
}

export default function Notification({ requestId, groupName }: propsType) {
  function handleAccept() {

  }
  function handleReject() {

  }

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
          onPress={handleReject}
        >
          <Image
            style={styles.button}
            source={require("../assets/accept.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleReject}
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