import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useModal } from 'react-native-modalfy';
import { Text } from 'react-native-paper';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import globalStyles from '../../../styles/globalStyles';
import { COLORS } from '../../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../../utils/styles';

type Props = {};

export default function Transaction({}: Props) {
  const { openModal } = useModal();
  return (
    <Pressable
      style={styles.container}
      onPress={() => openModal('TransactionDetailsModal')}
    >
      <View style={styles.leftSide}>
        <Ionicons
          name="swap-horizontal-outline"
          color={COLORS.primary}
          size={WINDOW_WIDTH * 0.07}
          style={styles.icon}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Transfer</Text>
          <Text style={styles.hash}>0x123...abc</Text>
        </View>
      </View>

      <View style={styles.rightSide}>
        <Text style={styles.value}>0.998 ETH</Text>
        <Text style={styles.timestamp}>Feb 19, 2025</Text>
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
