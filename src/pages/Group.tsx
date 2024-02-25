import { NavigationProp } from '@react-navigation/native';
import { Image } from 'moti';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NoFriendSection from '../components/NoFriendSection';
import { GroupDocument } from '../store/store';

type propsType = {
  navigation: NavigationProp<any>;
  route: {
    params: {
      group: GroupDocument;
    }
  }
}

export default function Group({ navigation, route }: propsType) {
  const { group } = route.params

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require("../assets/backButton.png")}
          style={styles.backButton}
        />
      </TouchableOpacity>
      <View style={styles.groupInfo}>
        {group.groupProfile ? (
          <Image
            source={{ uri: group.groupProfile }}
            style={styles.groupPhoto}
          />
        ) : (
          <Image
            source={require("../assets/defaultGroup.png")}
            style={styles.defaultGroupPhoto}
          />
        )}
        <View>
          <Text style={styles.infoLabel}>group name</Text>
          <Text style={styles.groupName}>{group.groupName}</Text>
        </View>
      </View>
      {group.members.length > 0 ? (
        <></>
      ) : (
        <NoFriendSection navigation={navigation} />
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    height: 40,
    width: 40,
    marginBottom: 20,
  },
  groupName: {
    color: "#222",
    fontSize: 30,
  },
  groupInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginBottom: 20
  },
  infoLabel: {
    color: "#aaa",
    textTransform: "uppercase"
  },
  groupPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  defaultGroupPhoto: {
    width: 80,
    height: 80,
  },

})