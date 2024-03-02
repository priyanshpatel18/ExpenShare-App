import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { GroupDocument, GroupUser } from '../store/store';

type propsType = {
  member: GroupUser;
  amount: number;
  targetGroup: GroupDocument | undefined;
}

export default function BalanceUser({ member, amount, targetGroup }: propsType) {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  return (
    <View style={styles.userBalanceContainer}>
      <Pressable
        onPress={() => setShowDropDown(!showDropDown)}
        style={styles.userBalance}
      >
        <View style={{ flexDirection: "row", gap: 10 }}>
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
            {member.userName}
            <Text>
              {amount > 0 ? ` gets back ` : ` owes `}
            </Text>
            <Text style={{ color: amount > 0 ? "#00a200" : "red" }}>
              {`₹${Math.abs(amount)} `}
            </Text>
            <Text>
              in total
            </Text>
          </Text>
        </View>
        <View>
          <Image
            source={require("../assets/dropUp.png")}
            style={[styles.dropDownIcon, !showDropDown && styles.dropDown]}
          />
        </View>
      </Pressable>
      {
        showDropDown &&
        <View style={styles.balanceContainer}>
          {targetGroup?.balances.map((balance, index) => (
            <View
              key={index}
            >
              {member._id === balance.creditorId._id && amount > 0 ? (
                balance.debtorIds.map((debtorId, index) => (
                  <View
                    key={index}
                    style={styles.dropDownUser}
                  >
                    {debtorId.profilePicture ?
                      <Image
                        source={{ uri: debtorId.profilePicture }}
                        style={styles.dropDownProfile}
                      />
                      :
                      <Image
                        source={require("../assets/defaultUser.png")}
                        style={styles.dropDownProfile}
                      />
                    }
                    <Text style={styles.dropDownText}>
                      {debtorId.userName} owes
                      <Text style={{ color: "#00a200" }}>{` ₹${(balance.amount / (balance.debtorIds.length + 1)).toFixed(2)}`}</Text>
                      {` to ${balance.creditorId.userName}`}
                    </Text>
                  </View>
                ))
              ) : (
                <>
                  {member._id === balance.debtorIds[0]._id && amount < 0 && (
                    <View style={styles.dropDownUser}>
                      {balance.creditorId.profilePicture ?
                        <Image
                          source={{ uri: balance.creditorId.profilePicture }}
                          style={styles.dropDownProfile}
                        />
                        :
                        <Image
                          source={require("../assets/defaultUser.png")}
                          style={styles.dropDownProfile}
                        />
                      }
                      <Text style={styles.dropDownText}>
                        {member.userName} owes
                        <Text style={{ color: "red" }}>
                          {` ₹${(balance.amount / (balance.debtorIds.length + 1)).toFixed(2)} `}
                        </Text>
                        to {balance.creditorId.userName}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          ))}
        </View>
      }
    </View>
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
    maxWidth: "70%"
  },
  dropDownIcon: {
    width: 25,
    height: 25,
  },
  dropDown: {
    transform: [{ rotate: "180deg" }]
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
  }
})