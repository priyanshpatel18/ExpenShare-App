import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from "react-native-file-viewer"

import { Store } from '../store/store';

type propsType = {
  navigation: NavigationProp<any>
}

export default function UserProfileOptions({ navigation }: propsType): React.JSX.Element {
  const store = Store();
  const [isPdfVisible, setIsPdfVisible] = useState<boolean>(false);
  const [pdfPath, setPdfPath] = useState<string>('');

  async function handleLogout() {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Welcome")
    store.showToastWithGravityAndOffset("Logged out Successfully")
  }

  async function createPDF() {
    let options = {
      html: '<h1>PDF TEST</h1>',
      fileName: 'test',
      directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options);
    const filePath: string = String(file.filePath)
    console.log(filePath);
    setPdfPath(filePath);
    setIsPdfVisible(true);
  }

  async function openPDF(filePath: string) {
    try {
      await FileViewer.open(filePath);
      console.log("File Opened Successfully");
    } catch (error) {
      console.log("Error Opening File");
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Account")}>
        <View style={styles.button}>
          <View style={[[styles.iconContainer, { backgroundColor: "#c8edff" }]]}>
            <Image
              style={styles.buttonIcon}
              source={require("../assets/account.png")}
            />
          </View>
          <Text style={styles.buttonText}>Account</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={createPDF}>
        <View style={styles.button}>
          <View style={[styles.iconContainer, { backgroundColor: "#ebcaff" }]}>
            <Image
              style={styles.buttonIcon}
              source={require("../assets/export.png")}
            />
          </View>
          <Text style={styles.buttonText}>Export</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Report")}>
        <View style={styles.button}>
          <View style={[styles.iconContainer, { backgroundColor: "#99f691" }]}>
            <Image
              style={styles.buttonIcon}
              source={require("../assets/report.png")}
            />
          </View>
          <Text style={styles.buttonText}>Report</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <View style={styles.button}>
          <View style={[styles.iconContainer, { backgroundColor: "#ffbebe" }]}>
            <Image
              style={styles.buttonIcon}
              source={require("../assets/logout.png")}
            />
          </View>
          <Text style={styles.buttonText}>Logout</Text>
        </View>
      </TouchableOpacity>
      <Modal visible={isPdfVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsPdfVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.pdfTitle}>PDF Viewer</Text>
          <TouchableOpacity style={styles.openButton} onPress={() => openPDF(pdfPath)}>
            <Text style={styles.openButtonText}>Open PDF</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: "#dfdfdf",
    borderRadius: 15,
    padding: 20,
    gap: 20,
    width: "90%",
  },
  button: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 30
  },
  iconContainer: {
    padding: 10,
    borderRadius: 10
  },
  buttonIcon: {
    height: 30,
    width: 30
  },
  buttonText: {
    fontSize: 30,
    color: "#222",
    textAlign: "center",
    fontFamily: "Montserrat-SemiBold",
    textTransform: "capitalize"
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  pdfTitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  pdfPath: {
    color: '#fff',
    fontSize: 16,
  },
  openButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 18,
  },
})