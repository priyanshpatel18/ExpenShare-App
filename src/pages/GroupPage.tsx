import { NavigationProp } from '@react-navigation/native'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import GradientText from '../components/GradientText'
import GroupComponent from '../components/GroupComponent'
import MenuBar from '../components/MenuBar'
import { GroupStore } from '../store/GroupStore'


type propsType = {
  navigation: NavigationProp<any>
}

export default function GroupPage({ navigation }: propsType): React.JSX.Element {
  const store = GroupStore();

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>groups</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddGroup")}>
        <GradientText
          text='add a group'
          style={styles.buttonText}
        />
      </TouchableOpacity>
      {store.groups.length > 0 &&
        <ScrollView style={styles.groupList}>
          {store.groups.map((group, index) => (
            <TouchableOpacity key={index} onPress={() => navigation.navigate("Group", { group })}>
              {group.groupProfile ? (
                <GroupComponent
                  groupPhoto={group.groupProfile}
                  groupName={group.groupName}
                  totalMembers={group.members.length}
                />
              ) : (
                <GroupComponent
                  groupName={group.groupName}
                  totalMembers={group.members.length}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      }
      <MenuBar navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center",
  },
  headingText: {
    fontFamily: "Montserrat-SemiBold",
    color: '#222',
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    padding: 10,
    textAlign: 'center',
    marginBottom: 10
  },
  addButton: {
    borderRadius: 10,
    marginBottom: 30,
    backgroundColor: "#eee",
    padding: 15,
    borderColor: "#aaa",
    borderWidth: 2
  },
  buttonText: {
    fontSize: 22,
    fontFamily: "Montserrat-Bold",
    textTransform: "uppercase"
  },
  groupList: {
    paddingHorizontal: 20,
    marginBottom: "20%"
  }
})