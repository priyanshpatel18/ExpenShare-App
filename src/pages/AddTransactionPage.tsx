import { NavigationProp } from '@react-navigation/native'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Loading from '../components/Loading'
import PersonalOptionsContainer from '../components/PersonalOptionsContainer'
import { Store } from '../store/store'


type propsType = {
  navigation: NavigationProp<any>
}

export default function AddPage({ navigation }: propsType) {
  const [showIncome, setShowIncome] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const store = Store();

  return (
    store.loading ? <Loading /> :
      <MotiView
        style={styles.container}
        from={{
          backgroundColor: showIncome ? '#2ABD42' : '#FF4545',
        }}
        animate={{
          backgroundColor: showIncome ? '#2ABD42' : '#FF4545',
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
              store.setTransactionType("expense")
            }}
          >
            <Image
              style={styles.backButton}
              source={require("../assets/backButton.png")}
            />
          </TouchableOpacity>
          <View style={styles.switchContainer}>
            <TouchableOpacity onPress={() => {
              setShowIncome(true)
              store.setTransactionType("income")
            }}>
              {showIncome ?
                <Text style={[styles.activeButtonText, styles.income, styles.button]}>income</Text>
                :
                <Text style={styles.switchButtonText}>Income</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setShowIncome(false)
              store.setTransactionType("expense")
            }}>
              {!showIncome ?
                <Text style={[styles.activeButtonText, styles.expense, styles.button]}>expense</Text>
                :
                <Text style={styles.switchButtonText}>expense</Text>
              }
            </TouchableOpacity>
          </View>
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
        <PersonalOptionsContainer
          amount={amount}
          showIncome={showIncome}
          navigation={navigation}
        />
      </MotiView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },
  income: {
    backgroundColor: "#2ABD42",
    padding: 10
  },
  expense: {
    backgroundColor: "#FF4545",
    padding: 10
  },
  buttonContainer: {
    padding: 20,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative"
  },
  backButton: {
    height: 40,
    width: 40,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  button: {
    borderRadius: 10
  },
  switchButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#EEE',
    borderRadius: 5,
  },
  switchButtonText: {
    color: "#222",
    fontSize: 18,
    textTransform: "uppercase",
    fontFamily: "Montserrat-SemiBold",
  },
  activeButtonText: {
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 20,
    fontFamily: "Montserrat-Bold"
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