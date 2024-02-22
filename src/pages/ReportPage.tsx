import { NavigationProp } from '@react-navigation/native';
import React, { useReducer } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DonutChart from '../components/DonutChart';
import MainChart from '../components/MainChart';
import { MotiView } from 'moti';
import Loading from '../components/Loading';

type propsType = {
  navigation: NavigationProp<any>
}

export default function ReportPage({ navigation }: propsType) {
  const percentages = [100, 80, 60, 40, 20, 10];
  const colors = ['#38D39F', '#FF4757', "#FFDD59", "#12CBC4", "#FA8231", "#1E90FF"];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          style={styles.headingButton}
          source={require("../assets/backButton.png")}
        />
      </TouchableOpacity>
      <View style={styles.headingContainer} >
        <Text style={styles.headingText}>Report</Text>
      </View >
      <MainChart percentages={percentages} colors={colors} />
      <DonutChart />
    </View>
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
  headingText: {
    color: "#222",
    fontSize: 30,
    fontFamily: "Montserrat-SemiBold",
  },
})

