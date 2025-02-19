import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import BackButton from '../../components/buttons/BackButton';
import globalStyles from '../../styles/globalStyles';
import { FONT_SIZE } from '../../utils/styles';

type Props = {};

export default function index({}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Transactions</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10
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
