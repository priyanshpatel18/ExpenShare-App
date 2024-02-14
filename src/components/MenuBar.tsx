import { NavigationProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

type propsType = {
  navigation: NavigationProp<any>
}

export default function MenuBar({ navigation }: propsType) {
  const route = useRoute();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/addButton.png")}
        style={styles.addButton}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonContainerLeft}>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate("Home") }}>
            <Image
              source={route.name === 'Home' ? require("../assets/homeSelected.png") : require("../assets/home.png")}
              style={styles.routeButton}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate("Transaction") }}>
            <Image
              source={route.name === 'Transaction' ? require("../assets/transactionSelected.png") : require("../assets/transaction.png")}
              style={styles.routeButton}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.buttonContainerRight}>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate("Group") }}>
            <Image
              source={route.name === 'Group' ? require("../assets/groupSelected.png") : require("../assets/group.png")}
              style={styles.routeButton}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate("User") }}>
            <Image
              source={route.name === 'User' ? require("../assets/userSelected.png") : require("../assets/user.png")}
              style={styles.routeButton}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CFCFCF",
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    height: "10%",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    position: "absolute",
    top: "-30%",
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
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
  }
});
