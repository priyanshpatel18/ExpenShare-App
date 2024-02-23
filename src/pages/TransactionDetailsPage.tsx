import { NavigationProp } from '@react-navigation/native';
import { Image, MotiView } from 'moti';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TransactionType } from '../store/store';

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
  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require("../assets/backButton.png")}
          style={styles.backButtonIcon}
        />
      </TouchableOpacity>
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
          <Text style={styles.text}>
            {transaction.transactionTitle}
          </Text>
        </View>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>
          Amount
        </Text>
        <Text style={[styles.text, { fontSize: 25 }]}>
          ₹ {transaction.transactionAmount}
        </Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>
          Notes
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={[styles.text, transaction.invoiceUrl ? { maxWidth: "80%" } : { maxWidth: "100%" }]} numberOfLines={5} ellipsizeMode="tail">
            {transaction.notes ? transaction.notes : `    -`}
          </Text>
          {transaction.invoiceUrl &&
            <Pressable onPress={() => setIsInvoiceVisible(true)}>
              <Image
                source={require("../assets/invoice.png")}
                style={styles.invoiceIcon}
              />
            </Pressable>
          }
        </View>
      </View>


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
              <Image source={{ uri: transaction.invoiceUrl }} style={styles.modalImage} />
            </MotiView>
          </Pressable>
        }
      </Modal>
    </View>
  );
};

export default TransactionDetailsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  label: {
    color: "#888"
  },
  text: {
    color: "#222",
    fontSize: 20
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