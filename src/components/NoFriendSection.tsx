import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type propsType = {
  navigation: NavigationProp<any>
}

export default function NoFriendSection({ navigation }: propsType) {
  return (
    <View style={styles.noFriendSection}>
      <Text style={{ color: "#666", fontSize: 15 }}>You're the only one here!</Text>
      <TouchableOpacity
        style={styles.addMemberContainer}
        onPress={() => navigation.navigate("AddMember")}
      >
        <View style={styles.addMemberIconContainer}>
          <Image
            source={require("../assets/addGroup.png")}
            style={styles.addMemberIcon}
          />
        </View>
        <Text style={styles.addMemberText}>add group members</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  noFriendSection: {
    display: "flex",
    alignItems: "center",
  },
  addMemberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginVertical: 20,
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10
  },
  addMemberIconContainer: {
    backgroundColor: "#cbcbcb",
    padding: 10,
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30
  },
  addMemberIcon: {
    width: 35,
    height: 35,
  },
  addMemberText: {
    color: "#222",
    textTransform: "capitalize",
    fontSize: 18
  }
})