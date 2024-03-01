import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NavigationProp } from '@react-navigation/native';
import { ScrollView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { GroupDocument, GroupUser, Store } from '../store/store';
import GradientButton from './GradientButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LightSpeedOutLeft } from 'react-native-reanimated';
import socket from '../utils/socket';

type propsType = {
  navigation: NavigationProp<any>;
  group: GroupDocument;
  transactionAmount: Number;
}

export default function GroupOptionsContainer({ transactionAmount, navigation, group }: propsType) {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  const maxDate = new Date();
  maxDate.setHours(0, 0, 0, 0);

  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<'date' | 'time' | null>(null);
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const store = Store();

  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const now = new Date();

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const dateFormatted = now.toLocaleDateString('en-US', options);

    setCurrentDate(dateFormatted);

    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeFormatted = now.toLocaleTimeString('en-US', timeOptions);

    setCurrentTime(timeFormatted);
  }, []);

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

  // Split
  const [showSplit, setShowSplit] = useState<boolean>(false);

  const adder: GroupUser | "" = group.members.find(member => member.email === store.userObject?.email) || '';

  const [selectedMembers, setSelectedMembers] = useState<string[]>([adder ? adder._id : '']);

  const toggleMemberSelection = (memberId: string) => {
    if (adder && memberId === adder._id) return;

    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  async function addGroupTransaction() {
    if (!transactionAmount.toString().trim() || transactionAmount === 0) {
      store.showSnackbar("Enter the amount");
      return;
    }

    if (!title.trim()) {
      store.showSnackbar("Enter the title");
      return;
    }

    if (selectedMembers.length === 1) {
      store.showSnackbar("Select someone to split with");
      return;
    }

    const token = await AsyncStorage.getItem("token");

    store.setLoading(true);

    const combinedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );
    const isoDate = combinedDateTime.toISOString();

    const formData = {
      token,
      groupId: group._id,
      paidBy: adder ? adder._id : "",
      splitAmong: selectedMembers,
      category: store.expenseTitle.toUpperCase(),
      transactionTitle: title,
      transactionAmount,
      transactionDate: isoDate,
    }

    axios
      .post("/group/addTransaction", formData)
      .then((res) => {
        store.showSnackbar(res.data.message);
        socket.emit("addTransaction", { groupId: group._id });
      })
      .catch(err => {
        if (axios.isAxiosError(err)) {
          store.showSnackbar(err.response?.data.message);
        } else {
          store.showSnackbar(err.message);
        }
      }).finally(() => {
        store.setLoading(false)
        navigation.navigate("Group", { group });
      })
  }


  return (
    <View style={styles.optionsContainer}>
      <ScrollView>
        <View>
          <View style={styles.option}>
            <Text style={styles.labelText}>Select a Category</Text>
            <TouchableOpacity style={styles.categoryContainer} onPress={() => navigation.navigate("Category")}>
              <View style={styles.categoryIconContainer}>
                <Image
                  source={store.transactionType === "expense" ? store.expenseIcon : store.incomeIcon}
                  style={styles.categoryIcon}
                />
              </View>
              <Text style={styles.categoryText}>
                {store.transactionType === "expense" ? store.expenseTitle : store.incomeTitle}
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

          <TouchableOpacity
            style={styles.option}
            onPress={() => setShowSplit(!showSplit)}
          >
            <Text style={[styles.labelText, { fontSize: 20, paddingVertical: 10 }]}>Select Splitting</Text>
          </TouchableOpacity>

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
      </ScrollView>

      {store.loading ?
        <TouchableOpacity style={styles.continueButton}
          onPress={() => Store.getState().showSnackbar("Adding...")}
        >
          <GradientButton text='continue' />
        </TouchableOpacity>
        :
        <TouchableOpacity
          style={styles.continueButton}
          onPress={addGroupTransaction}
        >
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

      <Modal
        visible={showSplit}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSplit(!showSplit)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.memberList}>
              <TouchableOpacity
                style={styles.selectAllButton}
                onPress={() => {
                  setSelectedMembers(group.members.map(member => member._id))
                }}
              >
                <Text style={styles.selectAllButtonText}>Select All</Text>
              </TouchableOpacity>

              {group.members.map((member, index) => {
                const isChecked = selectedMembers.includes(member._id);
                return (
                  <Pressable
                    key={index}
                    style={[styles.memberItem, { backgroundColor: isChecked ? '#F0F0F0' : 'transparent' }]}
                    onPress={() => toggleMemberSelection(member._id)}
                  >
                    <BouncyCheckbox
                      disableBuiltInState
                      size={25}
                      unfillColor='#fff'
                      fillColor='#08AA08'
                      iconStyle={{ borderColor: '#08AA08' }}
                      isChecked={isChecked}
                    />
                    <Text style={styles.memberName}>{member.userName}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FF3547' }]}
                onPress={() => {
                  setShowSplit(false)
                  setSelectedMembers([])
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#3CB371' }]}
                onPress={() => setShowSplit(!showSplit)}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>



    </View >
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
  dateAndTimeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontSize: 17,
    fontFamily: "Montserrat-Medium",
  },
  continueButton: {
    borderRadius: 50,
    overflow: "hidden",
    marginTop: 20
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    padding: 20,
    elevation: 5,
  },
  memberList: {
    flexGrow: 1,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  memberName: {
    color: "#222",
    fontSize: 16,
  },
  selectAllButton: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fcc93f',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectAllButtonText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
})