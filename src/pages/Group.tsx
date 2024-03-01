import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TransactionsComponent from '../components/TransactionsComponent';
import MembersComponent from '../components/MembersComponent';
import SettleUpComponent from '../components/SettleUpComponent';
import BalanceComponent from '../components/BalanceComponent';
import TotalsComponent from '../components/TotalsComponent';
import { GroupDocument } from '../store/Store';

type propsType = {
  navigation: NavigationProp<any>;
  route: {
    params: {
      group: GroupDocument;
    }
  }
}

export default function Group({ navigation, route }: propsType) {
  const { group } = route.params;

  const [selectedOption, setSelectedOption] = useState<string>("Transactions");

  const options: string[] = ["Transactions", "Members", "Settle Up", "Balance", "Totals"];

  const renderComponent = () => {
    switch (selectedOption) {
      case "Members":
        return <MembersComponent group={group} navigation={navigation} />;
      case "Settle Up":
        return <SettleUpComponent />;
      case "Balance":
        return <BalanceComponent group={group} />;
      case "Totals":
        return <TotalsComponent />;
      case "Transactions":
      default:
        return <TransactionsComponent group={group} navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/backButton.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require("../assets/settings.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.groupInfo}>
        {group.groupProfile ? (
          <Image
            source={{ uri: group.groupProfile }}
            style={styles.groupPhoto}
          />
        ) : (
          <Image
            source={require("../assets/defaultGroup.png")}
            style={styles.defaultGroupPhoto}
          />
        )}
        <View>
          <Text style={styles.infoLabel}>group name</Text>
          <Text style={styles.groupName}>{group.groupName}</Text>
        </View>
      </View>
      <View>
        <ScrollView style={styles.groupOptions} horizontal>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                selectedOption === option && styles.activeOption
              ]}
              onPress={() => setSelectedOption(option)}
            >
              <Text style={[styles.optionText, selectedOption === option && styles.activeText]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.componentContainer}>{renderComponent()}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    flex: 1
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  backButton: {
    height: 40,
    width: 40,
    marginBottom: 20,
  },
  groupName: {
    color: "#222",
    fontSize: 30,
    fontFamily: "Montserrat-SemiBold",
  },
  groupInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginBottom: 20
  },
  infoLabel: {
    color: "#aaa",
    textTransform: "uppercase",
    fontFamily: "Montserrat-SemiBold",
  },
  groupPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  defaultGroupPhoto: {
    width: 80,
    height: 80,
  },
  groupOptions: {
    marginBottom: 20
  },
  optionButton: {
    backgroundColor: "#eee",
    marginHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  optionText: {
    color: "#333",
    fontSize: 16,
    padding: 10,
    textTransform: "capitalize",
    fontFamily: "Montserrat-SemiBold",
  },
  activeOption: {
    backgroundColor: "#999",
  },
  activeText: {
    color: "#fff",
  },
  componentContainer: {
    flex: 1,
    height: "100%"
  }
});
