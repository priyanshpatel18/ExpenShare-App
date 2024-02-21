import { NavigationProp } from '@react-navigation/native'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import MenuBar from '../components/MenuBar'
import UserProfileOptions from '../components/ProfileOptions'
import { Store } from '../store/store'

type propsType = {
  navigation: NavigationProp<any>
}

export default function UserPage({ navigation }: propsType): React.JSX.Element {
  const store = Store();

  return (
    <View style={styles.container}>
      <Text>UserPage</Text>
      <View style={styles.userInfoContainer}>
        <View style={styles.details}>
          <View>
            {store.userObject?.profilePicture ?
              <Image
                style={styles.profilePicture}
                source={{ uri: store.userObject?.profilePicture }}
              />
              :
              <Image
                style={styles.profilePicture}
                source={{ uri: "https://res.cloudinary.com/dsl326wbi/image/upload/v1707911640/profile_m7bx7w.png" }}
              />
            }
          </View>
          <View>
            <Text style={styles.userName}>{store.userObject?.userName}</Text>
          </View>
        </View>
      </View>

      <View style={{ alignItems: "center" }}>
        <UserProfileOptions navigation={navigation} />
      </View>
      <MenuBar navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
  },
  userInfoContainer: {
    paddingHorizontal: 20,
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20
  },
  details: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20
  },
  profilePicture: {
    height: 80,
    width: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#000"
  },
  userName: {
    color: "#000",
    fontSize: 22,
    fontFamily: "Montserrat-SemiBold",
    marginVertical: 10,
    textAlign: "center"
  },
  userNameInput: {
    color: "#000",
    fontSize: 22,
    fontFamily: "Montserrat-SemiBold",
    marginVertical: 10,
    textAlign: "center",
    padding: 0
  },
})