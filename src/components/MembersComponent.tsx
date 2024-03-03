import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GroupDocument, Store } from '../store/store';
import NoFriendSection from './NoFriendSection';
import { MotiView } from 'moti';

type propsType = {
  group: GroupDocument;
  navigation: NavigationProp<any>
}

export default function MembersComponent({ group, navigation }: propsType) {
  const store = Store();

  const userEmail = store.userObject?.email;
  const groupCreator = group.createdBy?.email;

  const targetGroup = store.groups.find(grp => grp._id === group._id);

  // Define state for tracking which member's alert is shown
  const [showAlertForMember, setShowAlertForMember] = useState<string | null>(null);

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
                    onPress={() => setShowAlertForMember(member.userName)} // Set alert for the clicked member
                  >
                    <Image
                      source={require("../assets/removeButton.png")}
                      style={styles.removeIcon}
                    />
                  </TouchableOpacity>}
              </View>
              {showAlertForMember === member.userName && (
                <Modal transparent visible={true}>
                  <Pressable style={styles.modalContainer}>
                    <MotiView
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
                      <View style={styles.alertContainer}>
                        <Text style={styles.alertText}>Are you sure you want to remove {member.userName}?</Text>
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            style={[styles.alertButton, styles.cancelButton]}
                            onPress={() => setShowAlertForMember(null)}
                          >
                            <Text style={[styles.alertButtonText]}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.alertButton, styles.okButton]}
                            onPress={() => {
                              setShowAlertForMember(null);
                              store.handleRemoveMember(member.email, targetGroup);
                            }}
                          >
                            <Text style={[styles.alertButtonText]}>OK</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </MotiView>
                  </Pressable>
                </Modal>
              )}
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    maxWidth: "90%"
  },
  alertText: {
    textAlign: "center",
    width: "70%",
    color: "#222",
    fontSize: 20,
  },
  buttonContainer: {
    marginTop: 15,
    flexDirection: "row",
    gap: 20
  },
  alertButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#58B9E6"
  },
  okButton: {
    backgroundColor: "#ff4545"
  },
  alertButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
  }
})