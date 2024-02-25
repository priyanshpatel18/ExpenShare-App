import { NavigationProp } from '@react-navigation/native';
import { ScrollView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import GradientText from '../components/GradientText';
import SearchUser from '../components/SearchUser';
import socket from '../utils/socket';

type propsType = {
  navigation: NavigationProp<any>;
}

interface UserObject {
  userName: string;
  profilePicture: string | undefined | null;
}

export default function AddMemberPage({ navigation, }: propsType) {
  const [textInput, setTextInput] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<UserObject[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserObject[]>([]);

  useEffect(() => {
    socket.on("filteredUsers", (users: UserObject[]) => {
      const filtered = users.filter(user => !selectedUsers.find(selectedUser => selectedUser.userName === user.userName));

      const merged = [...selectedUsers, ...filtered];

      setFilteredUsers(merged);
    });

    return () => {
      socket.off("filteredUsers");
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

  function handleSendRequest() {
    socket.emit("sendRequest", selectedUsers);
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
    borderBottomWidth: 2,
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