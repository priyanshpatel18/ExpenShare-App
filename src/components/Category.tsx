import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { userStore } from '../store/userStore';


type propsType = {
  categoryIcon: any;
  categoryText: string;
  navigation: NavigationProp<any>
}

export default function Category({ categoryIcon, categoryText, navigation }: propsType) {
  const store = userStore();

  function handleCategorySelect() {
    if (store.transactionType === "income") {
      store.setIncomeIcon(categoryIcon)
      store.setIncomeTitle(categoryText.toUpperCase())
    }
    else {
      store.setExpenseIcon(categoryIcon)
      store.setExpenseTitle(categoryText.toUpperCase())
    }
    navigation.goBack();
  }

  return (
    <TouchableOpacity style={styles.categoryContainer} onPress={handleCategorySelect}>
      <View style={styles.categoryIconContainer}>
        <Image
          style={styles.categoryIcon}
          source={categoryIcon}
        />
      </View>
      <View style={styles.categoryTextContainer}>
        <Text style={styles.categoryText}>{categoryText}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  categoryContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexBasis: "33.33%"
  },
  categoryIconContainer: {
    padding: 10,
    backgroundColor: "#e1e1e1",
    height: 50,
    width: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50
  },
  categoryIcon: {
    height: 25,
    width: 25,
  },
  categoryTextContainer: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  categoryText: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    textTransform: "capitalize"
  }
})