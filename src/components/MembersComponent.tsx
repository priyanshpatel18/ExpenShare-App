import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GroupDocument, Store } from '../store/store';
import NoFriendSection from './NoFriendSection';

type propsType = {
  group: GroupDocument;
  navigation: NavigationProp<any>
}

export default function MembersComponent({ group, navigation }: propsType) {
  const store = Store()

  const userEmail = store.userObject?.email;
  const groupCreator = group.createdBy?.email;

  const targetGroup = store.groups.find(grp => grp._id === group._id);

  return (
    <>
      <ScrollView style={styles.container}>
        {targetGroup?.members.map((member, index) => {
          return (
            <View key={index}>
              <View style={styles.memberContainer} >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  {member.profilePicture ?
                    <Image
                      source={{ uri: member.profilePicture }}
                      style={styles.userProfile}
                    />
                    :
                    <Image
                      source={require("../assets/defaultUser.png")}
                      style={styles.userProfile}
                    />
                  }
                  <Text style={styles.userName}>
                    {member.userName}
                  </Text>
                </View>
                {userEmail === groupCreator && member.email !== userEmail &&
                  <TouchableOpacity
                    onPress={() => store.handleRemoveMember(member.email, group._id, navigation)}
                  >
                    <Image
                      source={require("../assets/removeButton.png")}
                      style={styles.removeIcon}
                    />
                  </TouchableOpacity>}
              </View>
            </View>
          )
        })}
        <NoFriendSection group={group} navigation={navigation} />
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomColor: "#666",
    borderBottomWidth: 1,
    paddingBottom: 10
  },
  userProfile: {
    width: 70,
    height: 70,
    borderRadius: 35
  },
  userName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: "#222"
  },
  removeIcon: {
    width: 30,
    height: 30
  },
})