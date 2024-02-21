import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TransactionType } from '../store/store';

type propsType = {
  transaction: TransactionType;
};

export default function TransactionDetails({ transaction }: propsType): React.JSX.Element {
  const date = new Date(transaction.transactionDate);

  // Format the date
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  // Format the time
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

  return (
    <View style={styles.container}>
      <View style={styles.transactionDetails}>
        <Text style={styles.details}>{formattedDate}</Text>
        <Text style={styles.details}>{formattedTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
});
