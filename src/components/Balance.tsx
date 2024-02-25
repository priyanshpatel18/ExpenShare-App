import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { UserStore } from '../store/UserStore';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

export default function Balance(): React.JSX.Element {
  const store = UserStore();

  const animatedValue = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null)

  function formatAmount(amount: number): string {
    const formattedAmount =
      Number(amount) > 100000 ?
        Number(amount) < 999999 ? `${(Number(amount) / 1000).toFixed(2)}K`
          : `${(Number(amount) / 1000000).toFixed(2)}M`
        : String(amount);

    return formattedAmount;
  }

  const animation = (toValue: number) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration: 800,
      useNativeDriver: true,
      delay: 0
    }).start();
  }

  useEffect(() => {
    const amount = store.totalBalance;
    let balance = amount;

    if (amount > 100000 && amount < 999999) {
      balance = amount / 1000;
    }
    if (amount > 999999) {
      balance /= 1000000
    }

    animation(balance);

    animatedValue.addListener(v => {
      if (inputRef.current) {
        inputRef.current.setNativeProps({
          text: `${Math.round(v.value)}`
        })
      }
    })

    return (() => {
      animatedValue.removeAllListeners()
    })
  }, [])

  return (
    <LinearGradient
      colors={['#2faae3', '#c968ff', '#e680b1', '#fb9475']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceContainer}
    >
      <View>
        <Text style={styles.balanceHeading}>Total Balance</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Text style={styles.mainBalance}>₹</Text>
          <AnimatedInput
            ref={inputRef}
            underlineColorAndroid="transparent"
            editable={false}
            defaultValue='0'
            style={styles.mainBalance}
          />
          {store.totalBalance > 100000 && store.totalBalance < 999999 ? (
            <Text style={styles.mainBalance}>K</Text>
          ) :
            store.totalBalance > 999999
            &&
            <Text style={styles.mainBalance}>M</Text>
          }
        </View>
        <View style={styles.boxContainer}>
          <View style={styles.box}>
            <View style={styles.balanceIconContainer}>
              <Image
                style={styles.balanceIcon}
                source={require("../assets/upArrow.png")}
              />
            </View>
            <View style={{}}>
              <Text style={styles.boxText}>Income</Text>
              <Text style={styles.boxText}>₹{formatAmount(store.totalIncome)}</Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.balanceIconContainer}>
              <Image
                style={styles.balanceIcon}
                source={require("../assets/downArrow.png")}
              />
            </View>
            <View style={{}}>
              <Text style={styles.boxText}>Expense</Text>
              <Text style={styles.boxText}>₹{formatAmount(store.totalExpense)}</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient >
  )
}

const styles = StyleSheet.create({
  balanceContainer: {
    margin: 20,
    borderRadius: 30,
    padding: 10
  },
  balanceHeading: {
    textAlign: "center",
    margin: 5,
    fontSize: 20,
    color: "#fff",
    fontFamily: "Montserrat-Bold"
  },
  mainBalance: {
    textAlign: "center",
    marginBottom: 5,
    fontSize: 45,
    color: "#fff",
    fontFamily: "Montserrat-ExtraBold"
  },
  boxContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 20
  },
  box: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  boxText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold"
  },
  balanceIconContainer: {
    height: 30,
    width: 30,
    backgroundColor: "#fff",
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  balanceIcon: {
    height: 25,
    width: 25
  }
})