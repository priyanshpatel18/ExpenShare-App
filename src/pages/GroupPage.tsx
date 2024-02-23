import { NavigationProp } from '@react-navigation/native'
import React, { useState } from 'react'
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MenuBar from '../components/MenuBar'
import GradientButton from '../components/GradientButton'
import { Store } from '../store/store'
import Group from '../components/Group'
import GradientText from '../components/GradientText'
import AddGroup from '../components/AddGroup'

type propsType = {
  navigation: NavigationProp<any>
}

export default function GroupPage({ navigation }: propsType): React.JSX.Element {
  const store = Store();
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [showGroup, setShowGroup] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>groups</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setOpenAddGroup(true)}>
        <GradientText
          text='add a group'
          style={styles.buttonText}
        />
      </TouchableOpacity>
      <ScrollView style={styles.groupList}>
        <TouchableOpacity>
          <Group
            groupPhoto="https://c4.wallpaperflare.com/wallpaper/683/602/386/1x1-dark-fire-gray-wallpaper-preview.jpg"
            groupName='Tech Wizards'
            totalMembers={10}
          />
        </TouchableOpacity>
      </ScrollView>
      <MenuBar navigation={navigation} />

      <Modal visible={openAddGroup} animationType='slide'>
        <AddGroup setOpenAddGroup={setOpenAddGroup} />
      </Modal>
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
    fontSize: 30,
    fontFamily: "Montserrat-Bold",
    textTransform: "uppercase"
  },
  groupList: {
    paddingHorizontal: 20,
    marginBottom: "20%"
  }
})