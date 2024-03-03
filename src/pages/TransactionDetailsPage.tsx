import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NavigationProp } from '@react-navigation/native';
import { Image, MotiView } from 'moti';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Store, TransactionType } from '../store/store';
import Loading from '../components/Loading';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type propsType = {
  route: {
    params: {
      transaction: TransactionType
      imageUrl: any,
    }
  },
  navigation: NavigationProp<any>
}

const TransactionDetailsPage = ({ route, navigation }: propsType) => {
  const { transaction } = route.params;
  const store = Store();
  const [editMode, setEditMode] = useState(false);

  const transactionDate = new Date(transaction.transactionDate);

  const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const [formattedDate, setFormattedDate] = useState(transactionDate.toLocaleDateString('en-US', dateOptions));
  const [formattedTime, setFormattedTime] = useState(transactionDate.toLocaleTimeString('en-US', timeOptions));

  function handleDateSelect(event: DateTimePickerEvent, selectedDate: Date | undefined) {
    const currentDate = selectedDate || time;

    const dateFormatted = currentDate.toLocaleDateString('en-US', dateOptions); // Update dateFormatted here

    setFormattedDate(dateFormatted);
    setModalVisible(false);
    setDate(currentDate);
    setMode(null);
  }

  const handleTimeSelect = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentTime = selectedDate || time;

    const timeFormatted = currentTime.toLocaleTimeString('en-US', timeOptions);

    setFormattedTime(timeFormatted);
    setModalVisible(false);
    setTime(currentTime);
    setMode(null);
  };

  function handleDelete() {
    if (transaction.type === "income" && store.totalBalance - Number(transaction.transactionAmount) < 0) {
      store.showSnackbar("Removing will cause a Negative Balance")
      return;
    }

    store.showSnackbar("Deleting Transaction")
    store.handleDeleteTransaction(transaction._id, transaction.transactionAmount, navigation, transaction.type);
  }

  // Edit States
  const [title, setTitle] = useState<string>(transaction.transactionTitle);
  const [amount, setAmount] = useState<string>(transaction.transactionAmount);
  const [notes, setNotes] = useState<string>(transaction.notes);
  const [invoiceImage, setInvoiceImage] = useState<string | undefined | null>(transaction.invoiceUrl);
  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<'date' | 'time' | null>(null);
  const [time, setTime] = useState(new Date(transaction.transactionDate));
  const [date, setDate] = useState(new Date(transaction.transactionDate));

  const maxDate = new Date();
  maxDate.setHours(0, 0, 0, 0);

  async function handleSave() {
    if (title.trim() === "" || amount.trim() === "") {
      store.showSnackbar("Title and Amount cannot be empty");
      return;
    }

    if (title.trim() === transaction.transactionTitle &&
      amount.trim() === transaction.transactionAmount.toString() &&
      notes.trim() === transaction.notes &&
      invoiceImage === transaction.invoiceUrl &&
      date.toISOString() === transaction.transactionDate &&
      time.toISOString() === transaction.transactionDate
    ) {
      setEditMode(!editMode);
      store.showSnackbar("No Changes");
      return;
    }

    const token = await AsyncStorage.getItem("token");

    const formData = new FormData();
    formData.append("token", token);

    const combinedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );

    if (invoiceImage) {
      const extension = invoiceImage.split('.').pop();
      formData.append("invoice", {
        uri: invoiceImage,
        type: `image/${extension}`,
        name: `invoice.${extension}`,
      })
    }

    formData.append("transactionId", transaction._id);
    formData.append("transactionAmount", amount ? amount : transaction.transactionAmount);
    formData.append("category", transaction.category);
    formData.append("transactionTitle", title ? title : transaction.transactionTitle);
    formData.append("transactionDate", combinedDateTime.toISOString());
    formData.append("type", transaction.type);
    formData.append("notes", notes ? notes : transaction.notes);


    store.setLoading(true);

    axios
      .post(
        "/transaction/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then(res => {
        store.setTotalBalance(res.data.totals.balance);
        if (transaction.type === "income") {
          store.setTotalIncome(res.data.totals.income);
        } else {
          store.setTotalExpense(res.data.totals.expense);
        }
        store.showSnackbar("Transaction Updated");
      })
      .catch(err => {
        if (axios.isAxiosError(err)) {
          Store.getState().showSnackbar(err.response?.data.message);
        } else {
          console.error(err);
        }
      })
      .finally(() => {
        store.setLoading(false);
      });

    setEditMode(!editMode);
  }

  return (
    store.loading ? <Loading />
      :
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../assets/backButton.png")}
              style={styles.backButtonIcon}
            />
          </TouchableOpacity>
          {editMode ?
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleSave}
            >
              <Image
                source={require("../assets/doneButton.png")}
                style={styles.backButtonIcon}
              />
            </TouchableOpacity>
            :
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setEditMode(!editMode)}
            >
              <Image
                source={require("../assets/editIcon.png")}
                style={styles.backButtonIcon}
              />
            </TouchableOpacity>
          }
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>
            Transaction Id
          </Text>
          <Text style={styles.text}>
            {transaction._id}
          </Text>
        </View>
        <View
          style={[styles.detailContainer, { flexDirection: "row", alignItems: "center", gap: 20 }]}
        >
          <Image
            source={route.params.imageUrl}
            style={styles.categoryContainer}
          />
          <View>
            <Text style={styles.label}>
              Title
            </Text>
            <TextInput
              value={title}
              style={styles.text}
              editable={editMode}
              onChangeText={setTitle}
            />
          </View>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>
            Amount
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.text, { fontSize: 30 }, transaction.type === "expense" ? { color: "#f00" } : { color: "#00a200" }]}>₹</Text>
            <TextInput
              value={amount}
              style={[styles.text, { fontSize: 30 }, transaction.type === "expense" ? { color: "#f00" } : { color: "#00a200" }]}
              editable={editMode}
              onChangeText={setAmount}
              keyboardType='numeric'
            />
          </View>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>
            Notes
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            {editMode ? (
              <TextInput
                value={notes}
                style={[styles.text, { maxWidth: "70%" }]}
                editable={editMode}
                onChangeText={setNotes}
                numberOfLines={1}
              />
            ) : (
              <Text
                style={[styles.text, transaction.invoiceUrl ? { maxWidth: "80%" } : { maxWidth: "100%" }]}
                numberOfLines={5}
                ellipsizeMode="tail"
              >
                {notes ? notes : "     -"}
              </Text>
            )}

            {editMode &&
              <View>
                <TouchableOpacity onPress={() => store.pickImage(setInvoiceImage)}>
                  <Image
                    source={require("../assets/addImageIcon.png")}
                    style={styles.invoiceIcon}
                  />
                </TouchableOpacity>
                {invoiceImage &&
                  <Pressable onPress={() => setIsInvoiceVisible(!isInvoiceVisible)}>
                    <Text style={styles.viewImage}>
                      View Image
                    </Text>
                  </Pressable>
                }
              </View>
            }
            {transaction.invoiceUrl && !editMode &&
              <Pressable onPress={() => setIsInvoiceVisible(!isInvoiceVisible)}>
                <Image
                  source={require("../assets/invoice.png")}
                  style={styles.invoiceIcon}
                />
              </Pressable>
            }
          </View>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>
            Transaction Date
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
            <Text style={styles.text}>
              {formattedDate}
            </Text>
            {editMode &&
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible)
                  setMode("date")
                }}
              >
                <Image
                  style={styles.iconsStyle}
                  source={require("../assets/calendar.png")}
                />
              </TouchableOpacity>
            }
            <Text style={styles.text}>
              {formattedTime}
            </Text>
            {editMode &&
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible)
                  setMode('time');
                }}
              >
                <Image
                  style={styles.iconsStyle}
                  source={require("../assets/clock.png")}
                />
              </TouchableOpacity>
            }
          </View>
        </View>
        {
          store.loading ? (
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: "#ff4545" }]}
              onPress={() => store.showSnackbar("Deleting Transaction")}
            >
              <Image
                source={require("../assets/dustbin.png")}
                style={styles.deleteIcon}
              />
              <Text style={styles.deleteText}>Delete Transaction</Text>
            </TouchableOpacity>)
            : (
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: "#ff4545" }]}
                onPress={handleDelete}
              >
                <Image
                  source={require("../assets/dustbin.png")}
                  style={styles.deleteIcon}
                />
                <Text style={styles.deleteText}>Delete Transaction</Text>
              </TouchableOpacity>
            )
        }

        <Modal visible={isInvoiceVisible} transparent={true}>
          {invoiceImage &&
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
      </View >
  );
};

export default TransactionDetailsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  backButton: {
    marginBottom: 20
  },
  backButtonIcon: {
    width: 40,
    height: 40,
  },
  detailContainer: {
    borderWidth: 2,
    borderColor: "#555",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  iconsStyle: {
    height: 30,
    width: 30,
  },
  label: {
    color: "#888"
  },
  text: {
    color: "#222",
    fontSize: 20
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
  invoiceIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 20
  },
  categoryContainer: {
    width: 50,
    height: 50
  },
  invoiceUrl: {
    alignSelf: "flex-end",
    color: "#539AEA"
  },
  deleteButton: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  deleteIcon: {
    width: 30,
    height: 30,
  },
  deleteText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20
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