import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function App() {
  return (
    <View>
      <Text style={styles.headingText}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headingText: {
    margin: 0,
  },
});
