import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import CopyableText from '../CopyableText';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function TransactionDetailsModal({
  modal: { closeModal }
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: FONT_SIZE['xl'], ...globalStyles.text }}>
          Transfer
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
              displayText="0x123...abc"
              value="0x123...abc"
              containerStyle={styles.addressContainer}
              textStyle={styles.addressText}
              iconStyle={{ color: COLORS.primary }}
            />
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.title}>Date</Text>
            <Text style={styles.info}>Feb 19, 2025</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.title}>From</Text>
            <CopyableText
              displayText="0x123...abc"
              value="0x123...abc"
              containerStyle={styles.addressContainer}
              textStyle={styles.addressText}
              iconStyle={{ color: COLORS.primary }}
            />
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.title}>To</Text>
            <CopyableText
              displayText="0x123...abc"
              value="0x123...abc"
              containerStyle={styles.addressContainer}
              textStyle={styles.addressText}
              iconStyle={{ color: COLORS.primary }}
            />
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.rowLeft}>
          <Text style={styles.title}>NONCE</Text>
          <Text style={styles.info}>#68</Text>
        </View>

        <View style={styles.amountContainer}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.title}>Amount</Text>
              <Text style={styles.title}>Estimated gas fee</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.info}>0.9998 ETH</Text>
              <Text style={styles.info}>0.0001 ETH</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={[styles.row, { alignItems: 'flex-start' }]}>
            <Text style={styles.title}>Total</Text>
            <View style={styles.rowRight}>
              <Text style={styles.info}>0.9999 ETH</Text>
              <Text style={styles.info}>$12.58</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>View on Explorer</Text>
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
