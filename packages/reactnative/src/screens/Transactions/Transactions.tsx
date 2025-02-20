import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import BackButton from '../../components/buttons/BackButton';
import { useTransactions } from '../../hooks/store/useTransactions';
import globalStyles from '../../styles/globalStyles';
import { FONT_SIZE } from '../../utils/styles';
import Transaction from './modules/Transaction';

type Props = {};

export default function Transactions({}: Props) {
  const { transactions } = useTransactions();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Transactions</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.hash}
        renderItem={({ item }) => <Transaction transaction={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  headerTitle: {
    marginLeft: 8,
    fontSize: FONT_SIZE['xl'] * 1.2,
    ...globalStyles.textMedium,
    marginBottom: -2
  }
});
