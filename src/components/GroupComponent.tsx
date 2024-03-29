import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type propsType = {
  groupPhoto?: string;
  groupName: string;
  totalMembers: number;
}

export default function GroupComponent({ groupPhoto, groupName, totalMembers }: propsType) {
  return (
    <View style={styles.container}>
      {groupPhoto ? (
        <Image
          source={{ uri: groupPhoto }}
          style={styles.groupPhoto}
        />
      ) : (
        <Image
          source={require("../assets/defaultGroup.png")}
          style={styles.defaultGroupPhoto}
        />
      )}
      <Text style={styles.groupTitle} numberOfLines={1} ellipsizeMode="tail">{groupName}</Text>
      <View style={styles.groupContainer}>
        <Text style={styles.members}>members</Text>
        <Text style={styles.memberCount}>{totalMembers}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ddd",
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    borderRadius: 10,
    borderColor: "#aaa",
    borderWidth: 2,
    width: "100%",
  },
  groupPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  defaultGroupPhoto: {
    width: 70,
    height: 70,
  },
  groupTitle: {
    color: "#222",
    fontSize: 22,
    fontFamily: "Montserrat-SemiBold",
    maxWidth: "60%"
  },
  groupContainer: {

  },
  members: {
    color: "#666",
    textTransform: "capitalize",
    textAlign: "center"
  },
  memberCount: {
    color: "#222",
    textAlign: "center",
    fontSize: 20
  }
})