import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import OptionsContainer from '../components/OptionsContainer';
import { Store } from '../store/store';
import CategoriesModal from './CategoriesModal';
import { MotiView } from 'moti';

type propsType = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddModal({ setVisible }: propsType): React.JSX.Element {
  const [showIncome, setShowIncome] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const store = Store();
  const [showCategories, setShowCategories] = useState<boolean>(false);

  return (
    <Modal transparent={false} animationType='slide' >
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
              setVisible(false);
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
        <OptionsContainer
          amount={amount}
          showIncome={showIncome}
          setVisible={setVisible}
          setShowCategories={setShowCategories}
        />
      </MotiView>
      {showCategories &&
        <Modal visible={showCategories} animationType="slide">
          <CategoriesModal setShowCategories={setShowCategories} />
        </Modal>
      }
    </Modal>
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
    fontSize: 60,
    fontFamily: "Montserrat-Bold",
    color: "#fff"
  },
  input: {
    fontSize: 60,
    fontFamily: "Montserrat-Bold",
    color: "#fff",
    width: "100%"
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
})