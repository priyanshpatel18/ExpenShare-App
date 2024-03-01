import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { GroupDocument } from '../store/store'

type propsType = {
  group: GroupDocument;
}

export default function BalanceComponent({ group }: propsType) {
  const balances = group.balances;

  return (
    <View>
      {group.members.map((member, index) => (
        <View
          key={index}
          style={styles.userBalance}
        >
          {member.profilePicture ? (
            <Image
              source={{ uri: member.profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <Image
              source={require("../assets/defaultUser.png")}
              style={styles.profilePicture}
            />
          )}
          <Text style={styles.userName}>
            {member.userName} in total
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  userBalance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10
  },
  profilePicture: {
    height: 60,
    width: 60,
    borderRadius: 30
  },
  userName: {
    color: "#222",
    fontSize: 18
  },
})