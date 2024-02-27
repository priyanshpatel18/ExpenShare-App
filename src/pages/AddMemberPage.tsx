import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { ScrollView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import GradientText from '../components/GradientText';
import SearchUser from '../components/SearchUser';
import { GroupDocument } from '../store/Store';
import { Store } from '../store/store';
import socket from '../utils/socket';

type propsType = {
  navigation: NavigationProp<any>;
  route: {
    params: {
      group: GroupDocument;
    }
  }
}

interface UserObject {
  userName: string;
  profilePicture: string | undefined | null;
}

export default function AddMemberPage({ navigation, route }: propsType) {
  const store = Store()

  const [textInput, setTextInput] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<UserObject[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserObject[]>([]);

  const groupId = route.params.group._id
  const groupName = route.params.group.groupName
  const currentUserName = store.userObject?.userName;


  useEffect(() => {
    socket.on("requestSent", (message: string) => {
      console.log(message);
      store.showSnackbar(message);
    })

    socket.on("filteredUsers", (users: UserObject[]) => {
      const filtered = users.filter(user =>
        !selectedUsers.find(selectedUser => selectedUser.userName === user.userName) &&
        user.userName !== currentUserName &&
        !route.params.group.members.some(member => member.userName === user.userName)
      );

      const merged = [...selectedUsers, ...filtered];
      setFilteredUsers(merged);
    });


    return () => {
      socket.off("filteredUsers");
      socket.off("requestSent");
    };
  }, [selectedUsers]);

  function handleChange(e: string) {
    setTextInput(e)
    if (e.trim() !== "") {
      socket.emit("getUsers", e);
    } else {
      setFilteredUsers(selectedUsers);
    }
  }

  async function handleSendRequest() {
    const data = {
      token: await AsyncStorage.getItem("token"),
      selectedUsers: selectedUsers.map(user => user.userName),
      groupId: groupId,
      groupName: groupName,
    }

    store.showSnackbar("Sending...");
    socket.emit("sendRequest", data);
    navigation.goBack();
  }

  function handleSelectUser(user: UserObject) {
    setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, user]);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require("../assets/backButton.png")}
          style={styles.backButton}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={textInput}
        onChangeText={handleChange}
        placeholder="Enter username or email"
        placeholderTextColor={"#aaa"}
        cursorColor={"#222"}
        keyboardType="web-search"
        autoFocus
      />
      {selectedUsers && (
        <View>
          <ScrollView style={{ height: "50%" }}>
            {filteredUsers.map((user, index) => (
              <SearchUser
                key={index}
                userName={user.userName}
                profilePicture={user.profilePicture}
                onSelectUser={handleSelectUser}
              />
            ))}
          </ScrollView>
        </View>
      )}

      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSendRequest}
      >
        <GradientText text='send request' style={styles.sendButtonText} />
      </TouchableOpacity>
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
  input: {
    color: "#333",
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: "#aaa",
    marginBottom: 20
  },
  sendButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  sendButtonText: {
    fontSize: 30,
    textTransform: 'uppercase',
  }
})