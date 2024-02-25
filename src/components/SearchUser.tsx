import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

interface UserObject {
  userName: string;
  profilePicture: string | undefined | null;
}
type propsType = {
  userName: string,
  profilePicture: string | null | undefined
  onSelectUser: (user: UserObject) => void
}

export default function SearchUser({ userName, profilePicture, onSelectUser }: propsType) {
  const [isSelected, setIsSelected] = useState(false);

  function handleSelect() {
    setIsSelected(!isSelected);
    onSelectUser({ userName, profilePicture });
  }

  return (
    <TouchableOpacity
      onPress={handleSelect}
      style={styles.searchResult}
    >
      <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
        {
          profilePicture ?
            <Image
              source={{ uri: profilePicture }}
              style={styles.userProfile}
            />
            :
            <Image
              style={styles.userProfile}
              source={require("../assets/defaultUser.png")}
            />
        }
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <BouncyCheckbox
        size={35}
        fillColor='#00BA00'
        iconStyle={{ borderColor: "#0f0" }}
        innerIconStyle={{ borderWidth: 2 }}
        disableBuiltInState
        isChecked={isSelected}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchResult: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 30,
    marginVertical: 10,
  },
  userProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#222",
  },
  userName: {
    color: "#222",
    fontSize: 20,
    textTransform: "lowercase"
  },
});
