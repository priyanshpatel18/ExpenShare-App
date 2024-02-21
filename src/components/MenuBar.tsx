import { NavigationProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Store } from '../store/store';
import AddModal from './AddModal';

type propsType = {
  navigation: NavigationProp<any>
}

export default function MenuBar({ navigation }: propsType): React.JSX.Element {
  const route = useRoute();
  const store = Store();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonContainerLeft}>
          <TouchableWithoutFeedback onPress={() => navigation.navigate("Home")}>
            <Image
              source={route.name === 'Home' ? require("../assets/homeSelected.png") : require("../assets/home.png")}
              style={styles.routeButton}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigation.navigate("Transaction")}>
            <Image
              source={route.name === 'Transaction' ? require("../assets/transactionSelected.png") : require("../assets/transaction.png")}
              style={styles.routeButton}
            />
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback onPress={() => {
          // navigation.navigate("AddTransaction")
          // store.setTransactionType("expense")
          setVisible(true)
        }}>
          <Image
            source={require("../assets/addButton.png")}
            style={styles.addButton}
          />
        </TouchableWithoutFeedback>
        <View style={styles.buttonContainerRight}>
          <TouchableWithoutFeedback onPress={() => navigation.navigate("Group")}>
            <Image
              source={route.name === 'Group' ? require("../assets/groupSelected.png") : require("../assets/group.png")}
              style={styles.routeButton}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigation.navigate("User")}>
            <Image
              source={route.name === 'User' ? require("../assets/userSelected.png") : require("../assets/user.png")}
              style={styles.routeButton}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
      {visible && <AddModal navigation={navigation} setVisible={setVisible} />}

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: "100%",
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  addButton: {
    height: 70,
    width: 70,
    borderRadius: 40,
    bottom: "7%"
  },
  buttonContainer: {
    backgroundColor: "#CFCFCF",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    width: "100%",
    height: "10%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainerLeft: {
    display: "flex",
    flexDirection: "row",
    gap: 25,
    paddingHorizontal: 25,
  },
  buttonContainerRight: {
    display: "flex",
    flexDirection: "row",
    gap: 25,
    paddingHorizontal: 25,
  },
  routeButton: {
    height: 40,
    width: 40,
  },
  animatedContainer: {
    position: 'absolute',
    height: "100%",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1
  },
});
