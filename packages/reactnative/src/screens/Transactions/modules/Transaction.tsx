import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import useNetwork from '../../../hooks/scaffold-eth/useNetwork';
import { Transaction as TransactionType } from '../../../store/reducers/Transactions';
import globalStyles from '../../../styles/globalStyles';
import { COLORS } from '../../../utils/constants';
import {
  parseTimestamp,
  truncateAddress
} from '../../../utils/helperFunctions';
import { FONT_SIZE, WINDOW_WIDTH } from '../../../utils/styles';

type Props = {
  transaction: TransactionType;
};

export default function Transaction({ transaction: tx }: Props) {
  const { openModal } = useModal();
  const network = useNetwork();
  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        openModal('TransactionDetailsModal', {
          transaction: tx
        })
      }
    >
      <View style={styles.leftSide}>
        {tx.type === 'transfer' ? (
          <Ionicons
            name="arrow-redo-outline"
            color={COLORS.primary}
            size={WINDOW_WIDTH * 0.07}
            style={styles.icon}
          />
        ) : (
          <Ionicons
            name="swap-horizontal-outline"
            color={COLORS.primary}
            size={WINDOW_WIDTH * 0.07}
            style={styles.icon}
          />
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{tx.title}</Text>
          <Text style={styles.hash}>#{truncateAddress(tx.hash)}</Text>
        </View>
      </View>

      <View style={styles.rightSide}>
        <Text style={styles.value}>
          {tx.value} {network.currencySymbol}
        </Text>
        <Text style={styles.timestamp}>{parseTimestamp(tx.timestamp)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  rightSide: {
    alignItems: 'flex-end'
  },
  icon: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 100,
    padding: 8
  },
  titleContainer: {},
  title: {
    fontSize: FONT_SIZE.lg,
    ...globalStyles.textMedium
  },
  hash: {
    fontSize: FONT_SIZE.md,
    ...globalStyles.text
  },
  value: {
    fontSize: FONT_SIZE.lg,
    ...globalStyles.textMedium
  },
  timestamp: {
    fontSize: FONT_SIZE.md,
    ...globalStyles.text
  }
});
