import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { NavigationProp } from '@react-navigation/native'
import axios from 'axios'
import { MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Store } from '../store/Store'
import { TransactionStore } from '../store/TransactionStore'
import { UserStore } from '../store/UserStore'
import GradientButton from './GradientButton'

type propsType = {
  amount: string,
  showIncome: boolean,
  navigation: NavigationProp<any>
}

export default function OptionsContainer({ amount, showIncome, navigation }: propsType): React.JSX.Element {
  // Store
  const store = Store();
  const userStore = UserStore();
  const transactionStore = TransactionStore();

  // Date and Time
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());

  const maxDate = new Date();
  maxDate.setHours(0, 0, 0, 0);

  function handleDateSelect(event: DateTimePickerEvent, selectedDate: Date | undefined) {
    const currentDate = selectedDate || time;

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const dateFormatted = currentDate.toLocaleDateString('en-US', options);

    setModalVisible(false)
    setDate(currentDate)
    setCurrentDate(dateFormatted);
    setMode(null);
  }

  const handleTimeSelect = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentTime = selectedDate || time;

    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeFormatted = currentTime.toLocaleTimeString('en-US', timeOptions);

    setModalVisible(false);
    setTime(currentTime)
    setCurrentTime(timeFormatted);
    setMode(null);
  };


  const [invoiceImage, setInvoiceImage] = useState<string | undefined | null>(null);
  const [isInvoiceVisible, setIsInvoiceVisible] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<'date' | 'time' | null>(null);


  // Request Inputs
  const [title, setTitle] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  async function handleCreateExpense() {
    if (!amount.trim() || !title.trim()) {
      store.showSnackbar("Enter All Details");
      return;
    }

    if (transactionStore.transactionType === "expense" && userStore.totalBalance - Number(amount) < 0) {
      store.showSnackbar("Insufficient Balance");
      return;
    }

    if (title.length > 15) {
      store.showSnackbar("Title must be short");
      return;
    }

    store.setLoading(true)
    const formData = new FormData()

    formData.append("incomeFlag", transactionStore.transactionType);
    formData.append("token", await AsyncStorage.getItem("token"))
    formData.append("amount", amount)
    if (transactionStore.transactionType === "income") {
      formData.append("category", transactionStore.incomeTitle.toUpperCase())
    } else {
      formData.append("category", transactionStore.expenseTitle.toUpperCase())
    }
    formData.append("title", title);
    formData.append("notes", notes);

    const combinedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );
    const isoDate = combinedDateTime.toISOString();

    formData.append("transactionDate", isoDate);

    if (invoiceImage) {
      const extension = invoiceImage.split(".").pop();
      formData.append("invoice", {
        uri: invoiceImage,
        name: `profilePicture.${extension}`,
        type: `image/${extension}`,
      });
    }

    axios
      .post("/transaction/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        transactionStore.setTransactionType("expense")
        if (showIncome) {
          store.showSnackbar("Income Added Successfully");
          userStore.setTotalBalance(userStore.totalBalance + Number(amount));
          userStore.setTotalIncome(userStore.totalIncome + Number(amount));
        } else {
          store.showSnackbar("Expense Added Successfully");
          userStore.setTotalBalance(userStore.totalBalance - Number(amount));
          userStore.setTotalExpense(userStore.totalExpense + Number(amount));
        }
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          store.showSnackbar(err.response?.data.message)
        } else {
          console.log(err);
        }
      })
      .finally(() => {
        transactionStore.fetchTransactions();
        store.setLoading(false);
      })
  }

  useEffect(() => {
    const now = new Date();

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const dateFormatted = now.toLocaleDateString('en-US', options);

    setCurrentDate(dateFormatted);

    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeFormatted = now.toLocaleTimeString('en-US', timeOptions);

    setCurrentTime(timeFormatted);
  }, []);

  return (
    <View style={styles.optionsContainer}>
      <ScrollView>
        <View>
          <View style={styles.option}>
            <Text style={styles.labelText}>Select a Category</Text>
            <TouchableOpacity style={styles.categoryContainer} onPress={() => navigation.navigate("Category")}>
              <View style={styles.categoryIconContainer}>
                <Image
                  source={transactionStore.transactionType === "expense" ?
                    transactionStore.expenseIcon : transactionStore.incomeIcon
                  }
                  style={styles.categoryIcon}
                />
              </View>
              <Text style={styles.categoryText}>
                {transactionStore.transactionType === "expense" ?
                  transactionStore.expenseTitle : transactionStore.incomeTitle
                }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.option}>
            <Text style={styles.labelText}>Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder='Add a Title'
              placeholderTextColor="#aaa"
              value={title}
              onChangeText={(title: string) => setTitle(title)}
            />
          </View>
          <View style={styles.option}>
            <Text style={styles.labelText}>Notes</Text>
            <View style={styles.notesInputContainer}>
              <TextInput
                style={styles.notesInput}
                placeholder='[Optional]'
                placeholderTextColor="#aaa"
                value={notes}
                onChangeText={(notes: string) => setNotes(notes)}
              />
              <TouchableWithoutFeedback onPress={() => {
                store.pickImage(setInvoiceImage)
              }}
              >
                <Image
                  source={require("../assets/addImageIcon.png")}
                  style={styles.addImageIcon}
                />
              </TouchableWithoutFeedback>
            </View>
            {invoiceImage &&
              <>
                <Text style={styles.viewImage} onPress={() => setIsInvoiceVisible(true)}>View Image</Text>
                <Modal visible={isInvoiceVisible} transparent={true}>
                  {isInvoiceVisible &&
                    <Pressable onPress={() => setIsInvoiceVisible(false)} style={styles.modalContainer}>
                      <MotiView
                        from={{
                          opacity: 0,
                          scale: 0.5,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          type: 'timing',
                        }}
                        style={styles.shape}
                      >
                        <Image source={{ uri: invoiceImage }} style={styles.modalImage} />
                      </MotiView>
                    </Pressable>
                  }
                </Modal>
              </>
            }
          </View>
          <View style={styles.dateAndTimeContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                setModalVisible(true)
                setMode("date")
              }}
            >
              <View style={styles.dateAndTimeOption}>
                <Text style={styles.dateAndTimeText}>{currentDate}</Text>
                <Image
                  style={styles.iconsStyle}
                  source={require("../assets/calendar.png")}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                setModalVisible(true)
                setMode('time');
              }}
            >
              <View style={styles.dateAndTimeOption}>
                <Text style={styles.dateAndTimeText}>{currentTime}</Text>
                <Image
                  style={styles.iconsStyle}
                  source={require("../assets/clock.png")}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView >
      {store.loading ?
        <TouchableOpacity style={styles.continueButton}
          onPress={() => Store.getState().showSnackbar("Adding...")}
        >
          <GradientButton text='continue' />
        </TouchableOpacity>
        :
        <TouchableOpacity style={styles.continueButton} onPress={handleCreateExpense}>
          <GradientButton text='continue' />
        </TouchableOpacity>
      }

      <Modal
        visible={modalVisible}
        transparent={true}
      >
        <TouchableOpacity>
          {mode && (
            <DateTimePicker
              testID='dateAndTimePicker'
              value={mode === "time" ? time : date}
              mode={mode}
              display="default"
              onChange={mode === "time" ? handleTimeSelect : handleDateSelect}
              maximumDate={maxDate}
            />
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  optionsContainer: {
    padding: 25,
    width: "100%",
    height: "65%",
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  labelText: {
    color: "#666",
    fontSize: 15,
    fontFamily: "Montserrat-SemiBold",
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 15,
    marginBottom: 20
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10
  },
  categoryIconContainer: {
    backgroundColor: "#e1e1e1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: 50,
    width: 50,
    borderRadius: 25
  },
  categoryIcon: {
    height: 25,
    width: 25,
  },
  categoryText: {
    color: "#222",
    fontSize: 20,
    textTransform: "capitalize",
    fontFamily: "Montserrat-SemiBold",
  },
  titleInput: {
    fontSize: 22,
    color: "#222",
    padding: 0,
    fontFamily: "Montserrat-SemiBold",
  },
  notesInputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  notesInput: {
    fontSize: 22,
    color: "#222",
    padding: 0,
    width: "85%",
    fontFamily: "Montserrat-SemiBold",
  },
  addImageIcon: {
    height: 40,
    width: 40
  },
  viewImage: {
    marginTop: 5,
    alignSelf: "flex-end",
    color: "#539AEA"
  },
  dateAndTimeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  dateAndTimeOption: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 15,
    marginBottom: 20
  },
  iconsStyle: {
    height: 30,
    width: 30
  },
  dateAndTimeText: {
    color: "#222",
    fontSize: 18,
    fontFamily: "Montserrat-Medium",
  },
  continueButton: {
    borderRadius: 50,
    overflow: "hidden",
    marginTop: 20
  },
  modalContainer: {
    display: "flex",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center"
  },
  shape: {
    justifyContent: 'center',
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'contain',
    height: "100%",
    width: "100%"
  },
  modalImage: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
  },
})