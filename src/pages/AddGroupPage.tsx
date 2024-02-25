import { NavigationProp } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import GradientButton from '../components/GradientButton'
import { Store } from '../store/store'

type propsType = {
  navigation: NavigationProp<any>
}
export default function AddGroupPage({ navigation }: propsType) {
  const store = Store();
  const [title, setTitle] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | undefined | null>();

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
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
                source={require("../assets/defaultGroup.png")}
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
            autoFocus
          />
        </View>
        {store.loading ?
          <TouchableOpacity style={styles.createButton}>
            <GradientButton text='create' />
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.createButton}
            onPress={() => store.handleCreateGroup(title, selectedImage, navigation)}
          >
            <GradientButton text='create' />
          </TouchableOpacity>
        }
      </View>
    </View>
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
  },
  createButton: {
    overflow: "hidden",
    borderRadius: 50,
    marginVertical: 20
  }
})