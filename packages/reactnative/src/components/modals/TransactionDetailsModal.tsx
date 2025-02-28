import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useNetwork } from '../../hooks/scaffold-eth';
import { Transaction } from '../../store/reducers/Transactions';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { parseTimestamp, truncateAddress } from '../../utils/scaffold-eth';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import CopyableText from '../CopyableText';

type Props = {
  modal: {
    closeModal: () => void;
    params: {
      transaction: Transaction;
    };
  };
};

export default function TransactionDetailsModal({
  modal: {
    closeModal,
    params: { transaction: tx }
  }
}: Props) {
  const network = useNetwork();

  const viewOnExplorer = () => {
    Linking.openURL(`${network.blockExplorer}/tx/${tx.hash}`);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: FONT_SIZE['xl'], ...globalStyles.text }}>
          {tx.title}
        </Text>
        <Ionicons
          name="close-outline"
          size={FONT_SIZE['xl'] * 1.7}
          onPress={closeModal}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.title}>Tx Hash</Text>
            <CopyableText
              displayText={truncateAddress(tx.hash)}
              value={tx.hash}
              containerStyle={styles.addressContainer}
              textStyle={styles.addressText}
              iconStyle={{ color: COLORS.primary }}
            />
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.title}>Date</Text>
            <Text style={styles.info}>{parseTimestamp(tx.timestamp)}</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.title}>From</Text>
            <CopyableText
              displayText={truncateAddress(tx.from)}
              value={tx.from}
              containerStyle={styles.addressContainer}
              textStyle={styles.addressText}
              iconStyle={{ color: COLORS.primary }}
            />
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.title}>To</Text>
            <CopyableText
              displayText={truncateAddress(tx.to)}
              value={tx.to}
              containerStyle={styles.addressContainer}
              textStyle={styles.addressText}
              iconStyle={{ color: COLORS.primary }}
            />
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.rowLeft}>
          <Text style={styles.title}>NONCE</Text>
          <Text style={styles.info}>#{tx.nonce}</Text>
        </View>

        <View style={styles.amountContainer}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.title}>Amount</Text>
              <Text style={styles.title}>Estimated gas fee</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.info}>
                {tx.value} {network.currencySymbol}
              </Text>
              <Text style={styles.info}>
                {tx.gasFee} {network.currencySymbol}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={[styles.row, { alignItems: 'flex-start' }]}>
            <Text style={styles.title}>Total</Text>
            <Text style={styles.info}>
              {tx.total} {network.currencySymbol}
            </Text>
          </View>
        </View>

        {network.blockExplorer && (
          <Text style={styles.footerText} onPress={viewOnExplorer}>
            View on Explorer
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    width: WINDOW_WIDTH * 0.9
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  content: {
    gap: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowLeft: {},
  rowRight: {
    alignItems: 'flex-end'
  },
  title: {
    fontSize: FONT_SIZE.md,
    ...globalStyles.textMedium,
    color: '#555'
  },
  info: {
    fontSize: FONT_SIZE.md,
    ...globalStyles.text
  },
  addressContainer: {
    paddingHorizontal: 15,
    paddingVertical: 4,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 24
  },
  addressText: {
    fontSize: FONT_SIZE['md'],
    ...globalStyles.textMedium,
    marginBottom: -2,
    color: COLORS.primary
  },
  divider: {
    backgroundColor: COLORS.divider,
    marginVertical: 16
  },
  amountContainer: {
    borderWidth: 0.3,
    borderColor: COLORS.divider,
    borderRadius: 15,
    padding: 10,
    marginTop: 16
  },
  footerText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: FONT_SIZE.lg,
    ...globalStyles.textSemiBold,
    color: COLORS.primary
  }
});
