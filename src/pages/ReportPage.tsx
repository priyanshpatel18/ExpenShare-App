import { NavigationProp } from '@react-navigation/native';
import { MotiView, ScrollView } from 'moti';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Store } from '../store/store';
import DonutChart from '../components/DonutChart';
import MainChart from '../components/MainChart';

type propsType = {
  navigation: NavigationProp<any>;
}

export default function ReportPage({ navigation }: propsType) {
  const store = Store();
  const [now, setNow] = useState(new Date());
  const [showMonths, setShowMonths] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');

  function generateReport(selectedMonth: string): { percentages: number[], colors: string[] } {
    const transactionsForMonth = store.transactions?.filter(transaction => {
      return transaction.transactionDate === selectedMonth;
    });

    const categories: { [key: string]: number } = {};
    let totalAmount = 0;

    // Calculate total amount and amount per category
    transactionsForMonth?.forEach(transaction => {
      const amount = Number(transaction.transactionAmount);
      totalAmount += amount;
      categories[transaction.category] = (categories[transaction.category] || 0) + amount;
    });

    // Sort categories by amount in descending order
    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);

    // Take the six categories with the highest amounts
    const topCategories = sortedCategories.slice(0, 6);

    // Calculate percentages for the top categories
    const percentages = topCategories.map(([_, amount]) => (amount / totalAmount) * 100);

    // Use predefined colors for the top categories
    const colors = ['#38D39F', '#FF4757', '#FFDD59', '#12CBC4', '#FA8231', '#1E90FF'];

    return { percentages, colors };
  }

  const { percentages, colors } = generateReport(selectedMonth);


  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          style={styles.headingButton}
          source={require("../assets/backButton.png")}
        />
      </TouchableOpacity>
      <View style={styles.headingContainer} >
        <Text style={styles.headingText}>Report</Text>
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.headingText}>Filters</Text>
        {/* <TouchableOpacity
          style={styles.filter}
          onPress={() => navigation.navigate("Category")}
        >
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            <Image
              source={store.expenseIcon}
              style={styles.categoryIcon}
            />
            <Text style={styles.categoryText}>{store.expenseTitle}</Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.filter}
          onPress={() => setShowMonths(!showMonths)}
        >
          <Text style={styles.label}>Month</Text>
          <Text style={styles.label}>{selectedMonth ? selectedMonth : now.toLocaleDateString('en-US', { month: 'long' })}</Text>
        </TouchableOpacity>
        <View style={styles.filter}>
          <Text style={styles.label}>Year</Text>
          <Text style={styles.label}>{now.getFullYear()}</Text>
        </View>
        <TouchableOpacity onPress={() => generateReport(selectedMonth)}>
          <Text style={styles.filterButton}>generate</Text>
        </TouchableOpacity>
      </View>
      <MainChart percentages={percentages} colors={colors} />
      <DonutChart />
      <Modal visible={showMonths} transparent={true}>
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
          style={styles.modalContainer}
        >
          <ScrollView style={styles.monthSelectionContainer}>
            {Array.from({ length: 12 }, (_, index) => {
              const month = new Date(now.getFullYear(), index, 1).toLocaleDateString('en-US', { month: 'long' });
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.monthItem}
                  onPress={() => {
                    setSelectedMonth(month);
                    setShowMonths(false);
                  }}
                >
                  <Text style={styles.monthText}>{month}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </MotiView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30
  },
  headingButton: {
    height: 40,
    width: 40,
    position: "absolute",
    top: 0,
    left: 0
  },
  filterContainer: {
    marginVertical: 10
  },
  headingText: {
    color: "#222",
    fontSize: 28,
    fontFamily: "Montserrat-SemiBold",
  },
  label: {
    color: "#222",
    fontSize: 16,
  },
  filter: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20
  },
  filterButton: {
    backgroundColor: "#bbb",
    paddingVertical: 10,
    paddingHorizontal: 25,
    fontSize: 20,
    color: "#fff",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  categoryContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center"
  },
  categoryText: {
    color: "#222",
    fontSize: 16,
  },
  categoryIcon: {
    height: 30,
    width: 30
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthSelectionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    maxHeight: "50%",
    width: "60%",
  },
  monthItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  monthText: {
    fontSize: 16,
    color: '#222',
  },
})

