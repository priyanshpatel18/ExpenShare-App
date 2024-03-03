import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { GroupDocument, GroupUser } from '../store/store';

type propsType = {
  userName: string | undefined;
  member: GroupUser;
  amount: number;
  targetGroup: GroupDocument | undefined;
}

export default function BalanceUser({ userName, member, amount, targetGroup }: propsType) {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const isUser = userName === member.userName

  return (
    <View style={styles.userBalanceContainer}>
      <Pressable

        onPress={() => {
          setShowDropDown(!showDropDown)
        }}
        style={styles.userBalance}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          {member.profilePicture ? (
            <Image
              source={{ uri: member.profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <Image
              source={require("../assets/defaultUser.png")}
              style={styles.profilePicture}
            />
          )}
          <Text style={styles.balanceText}>
            {isUser ? "you" : member.userName}
            {amount !== 0 ?
              <>
                <Text>{amount > 0 ? ` ${isUser ? "get" : "gets"} ` : ` ${isUser ? "owe" : "owes"} `}</Text>
                <Text style={{ fontWeight: "bold", color: amount >= 0 ? "#00a200" : "red" }}>{`₹${Math.abs(amount)} `}</Text>
                <Text>in total</Text>
              </>
              :
              <Text>{` ${isUser ? "are" : "is"} settled up`}</Text>
            }
          </Text>
        </View>
        <View>
          <Image
            source={require("../assets/dropUp.png")}
            style={[styles.dropDownIcon, { transform: [{ rotate: !showDropDown ? "180deg" : "0deg" }] }]}
          />
        </View>
      </Pressable>
      {
        showDropDown && (
          <View style={styles.balanceContainer}>
            {targetGroup?.balances.map((balance, index) => (
              <View key={index}>
                {balance.debtor._id === member._id && (
                  <View style={styles.dropDownUser}>
                    <Image
                      source={
                        balance.creditor.profilePicture
                          ? { uri: balance.creditor.profilePicture }
                          : require("../assets/defaultUser.png")
                      }
                      style={styles.dropDownProfile}
                    />
                    <Text style={styles.dropDownText}>
                      {`${balance.debtor.userName} owes ${balance.creditor.userName} `}
                      <Text style={{ fontWeight: "bold", color: "red" }}>₹{balance.amount}</Text>
                    </Text>
                  </View>
                )}
                {balance.creditor._id === member._id && (
                  <View style={styles.dropDownUser}>
                    <Image
                      source={
                        balance.debtor.profilePicture
                          ? { uri: balance.debtor.profilePicture }
                          : require("../assets/defaultUser.png")
                      }
                      style={styles.dropDownProfile}
                    />
                    <Text style={styles.dropDownText}>
                      {`${balance.creditor.userName} gets back `}
                      <Text style={{ fontWeight: "bold", color: "#00a200" }}>₹{balance.amount}</Text>
                      {` from ${balance.debtor.userName}`}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

        )
      }

    </View >
  )
}

const styles = StyleSheet.create({
  userBalanceContainer: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  userBalance: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  profilePicture: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderColor: "#222",
    borderWidth: 2
  },
  balanceText: {
    color: "#222",
    fontSize: 18,
    maxWidth: "70%",
  },
  dropDownIcon: {
    width: 25,
    height: 25,
  },
  balanceContainer: {
    marginTop: 10,
  },
  dropDownUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 30,
    marginBottom: 15
  },
  dropDownProfile: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: "#222",
    borderWidth: 1.5
  },
  dropDownText: {
    color: "#777",
    maxWidth: "70%",
  },
})