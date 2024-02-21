import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Category from '../components/Category';
import ExpenseList from "../data/ExpenseCategories";
import IncomeList from "../data/IncomeCategories";
import { Store } from '../store/store';

type propsType = {
  setShowCategories: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CategoriesModal({ setShowCategories }: propsType): React.JSX.Element {
  const store = Store();
  const CategoryList = store.transactionType === "income" ? IncomeList : ExpenseList;

  const [Data, setData] = useState(CategoryList);
  const [filteredData, setFilteredData] = useState(CategoryList);
  const [search, setSearch] = useState<string>("");

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = Data.filter(category =>
      category.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredData);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setShowCategories(false)}>
          <Image
            style={styles.backButton}
            source={require("../assets/backButton.png")}
          />
        </TouchableOpacity>
        <TextInput
          placeholder='Search Categories'
          placeholderTextColor="#aaa"
          style={styles.categoryInput}
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      <ScrollView style={{ marginBottom: 30 }}>
        <View style={styles.categoryContainer}>
          {filteredData.map((category, index) =>
            <Category
              key={index}
              categoryIcon={category.source}
              categoryText={category.name}
              setShowCategories={setShowCategories}
            />
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    backgroundColor: "#fff",
    padding: 20
  },
  topBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    gap: 20,
    marginBottom: 25
  },
  backButton: {
    height: 40,
    width: 40,
  },
  categoryInput: {
    backgroundColor: "#ddd",
    padding: 10,
    fontSize: 16,
    color: "#000",
    borderRadius: 10,
    flex: 1
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
