import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Store } from '../store/store';
import SearchUser from './SearchUser';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type propsType = {
  setOpenAddGroup: React.Dispatch<React.SetStateAction<boolean>>
}

interface AllUserObject {
  userName: string,
  email: string,
  profilePicture: string
}

export default function AddGroup({ setOpenAddGroup }: propsType) {
  const store = Store();
  const [title, setTitle] = useState<string>("");
  const [emailOrUserName, setEmailOrUserName] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | undefined | null>();
  const [originalUsers, setOriginalUsers] = useState<AllUserObject[] | undefined>(undefined);
  const [filteredUsers, setFilteredUsers] = useState<AllUserObject[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      store.setLoading(true);

      const token: string | null = await AsyncStorage.getItem("token");
      axios
        .post("/user/getAllUsers", { token })
        .then((res) => {
          setOriginalUsers(res.data.users);
          setFilteredUsers(res.data.users);
        })
        .catch((err) => {
          store.showToastWithGravityAndOffset(err.response.data.message)
        })
        .finally(() => {
          store.setLoading(false);
        })
    }

    fetchData();
  }, [])

  function handleChange(text: string) {
    setEmailOrUserName(text);

    const filtered = originalUsers?.filter(user => {
      return user.userName.toLowerCase().includes(text.toLowerCase());
    })
    setFilteredUsers(filtered);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <TouchableOpacity
          onPress={() => {
            setOpenAddGroup(false);
          }}
        >
          <Image
            source={require("../assets/backButton.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.headingText}>add group</Text>
      </View>
      <View>
        <TouchableWithoutFeedback
          onPress={() => store.pickImage(setSelectedImage)}
        >
          <View style={styles.imageContainer}>
            {selectedImage ? (
              <Image
                style={styles.profileImage}
                source={{ uri: selectedImage }}
              />
            ) : (
              <Image
                style={styles.defaultProfile}
                source={{ uri: "https://res.cloudinary.com/dsl326wbi/image/upload/v1708605034/diversity_aohzw1.png" }}
              />
            )}
            <View style={styles.addIconContainer}>
              <Text style={styles.addIcon}>+</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Group Title</Text>
          <TextInput
            value={title}
            placeholder='Group Name'
            placeholderTextColor="#aaa"
            cursorColor="#aaa"
            onChangeText={(text: string) => setTitle(text)}
            style={styles.titleInput}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Group Members</Text>
          <TextInput
            value={emailOrUserName}
            placeholder='Search Members'
            placeholderTextColor="#aaa"
            cursorColor="#aaa"
            onChangeText={(text: string) => handleChange(text)}
            style={styles.titleInput}
            keyboardType="default"
            autoCapitalize="none"
          />
        </View>
        {emailOrUserName && filteredUsers && filteredUsers.length > 0 &&
          <ScrollView style={styles.totalUsers}>
            {filteredUsers.map((user, index) => (
              <View key={index}>
                <SearchUser userName={user.userName} profilePicture={user.profilePicture} />
                {filteredUsers.length > 1 && <View style={styles.separator} />}
              </View>
            ))}
          </ScrollView>
        }
      </View>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "100%",
    width: "100%"
  },
  headingContainer: {
    flexDirection: "row",
    gap: 30,
    marginBottom: 20
  },
  backButton: {
    height: 40,
    width: 40,
  },
  headingText: {
    fontFamily: "Montserrat-SemiBold",
    color: '#222',
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 10,
    textAlign: "center"
  },
  inputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 15,
    marginBottom: 20
  },
  labelText: {
    color: "#666",
    fontSize: 15,
    fontFamily: "Montserrat-SemiBold",
  },
  titleInput: {
    fontSize: 22,
    color: "#222",
    padding: 0,
    fontFamily: "Montserrat-SemiBold",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 30,
    alignSelf: "center"
  },
  addIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#f00",
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    position: "absolute",
    fontSize: 25,
    color: "#fff",
  },
  defaultProfile: {
    height: 90,
    width: 90
  },
  profileImage: {
    height: 90,
    width: 90,
    borderRadius: 50,
  },
  totalUsers: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#ccc",
    padding: 12,
    backgroundColor: "#EEE",
    marginTop: -15
  },
  iconComponent: {
    height: 35,
    width: 35
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "#CCC"
  }
})