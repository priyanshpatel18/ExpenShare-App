import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import GroupOptionsContainer from '../components/GroupOptionsContainer';
import { GroupDocument, Store } from '../store/store';

type propsType = {
  navigation: NavigationProp<any>
  route: {
    params: {
      group: GroupDocument;
    }
  }
}

export default function AddGroupTransactionPage({ navigation, route }: propsType) {
  const [amount, setAmount] = useState<string>("");

  return (
    <View
      style={styles.container}
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Image
            style={styles.backButton}
            source={require("../assets/backButton.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.howMuch}>How much?</Text>
        <View style={styles.textInput}>
          <Text style={styles.rupeeText}>₹</Text>
          <TextInput
            value={amount}
            keyboardType='numeric'
            onChangeText={(text: string) => {
              const sanitizedText = text.replace(/[^0-9.]/g, '').replace(/^(\d*\.\d*).*$/, '$1');
              setAmount(sanitizedText);
            }}
            placeholder='0.00'
            style={styles.input}
            maxLength={7}
          />
        </View>
      </View>
      <GroupOptionsContainer
        transactionAmount={Number(amount)}
        navigation={navigation}
        group={route.params.group}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF4545",
    justifyContent: "space-between"
  },
  buttonContainer: {
    padding: 20,
  },
  backButton: {
    height: 40,
    width: 40,
  },
  inputContainer: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    paddingHorizontal: 30
  },
  howMuch: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "Montserrat-SemiBold"
  },
  textInput: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  rupeeText: {
    fontSize: 55,
    fontFamily: "Montserrat-Bold",
    color: "#fff"
  },
  input: {
    fontSize: 55,
    fontFamily: "Montserrat-Bold",
    color: "#fff",
    width: "100%"
  },
})