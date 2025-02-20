import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import globalStyles from '../../styles/globalStyles';
import { parseBalance } from '../../utils/helperFunctions';
import { FONT_SIZE, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/styles';
import Blockie from '../Blockie';

type Props = {
  modal: {
    closeModal: (modal?: string, callback?: () => void) => void;
    params: {
      message: any;
      onReject: () => void;
      onConfirm: () => void;
    };
  };
};

export default function SignMessageModal({
  modal: { closeModal, params }
}: Props) {
  const account = useAccount();
  const network = useNetwork();
  const { balance } = useBalance({ address: account.address });

  const sign = () => {
    closeModal('SignMessageModal', params.onConfirm);
  };

  const reject = () => {
    closeModal();
    params.onReject();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.accountInfo}>
          <Blockie address={account.address} size={1.8 * FONT_SIZE.xl} />
          <View>
            <Text variant="bodyMedium" style={styles.networkName}>
              {network.name} network
            </Text>
            <Text variant="bodyMedium" style={styles.accountName}>
              {account.name}
            </Text>
          </View>
        </View>

        <View style={styles.balanceInfo}>
          <Text variant="bodyMedium" style={globalStyles.text}>
            Balance
          </Text>
          <Text variant="bodyMedium" style={styles.balance}>
            {balance !== null
              ? `${parseBalance(balance)} ${network.currencySymbol}`
              : null}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Text variant="headlineMedium" style={styles.title}>
            Signature Request
          </Text>

          <Text variant="bodyMedium" style={styles.subtitle}>
            Only sign this message if you fully understand the content and trust
            this platform
          </Text>

          <Text variant="bodyMedium" style={styles.label}>
            You are signing:
          </Text>
        </View>

        <View style={styles.messageContainer}>
          <Text variant="titleLarge" style={styles.messageLabel}>
            Message:
          </Text>
          <Text variant="bodySmall" style={styles.message}>
            {JSON.stringify(params.message)}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={reject}
          buttonColor="#FFCDD2"
          style={{ flex: 1, paddingVertical: 4, borderRadius: 30 }}
          labelStyle={{ fontSize: FONT_SIZE['lg'], ...globalStyles.text }}
        >
          Reject
        </Button>
        <Button
          mode="contained"
          onPress={sign}
          style={{ flex: 1, paddingVertical: 4, borderRadius: 30 }}
          labelStyle={{
            fontSize: FONT_SIZE['lg'],
            ...globalStyles.text,
            color: 'white'
          }}
        >
          Sign
        </Button>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  networkName: {
    fontSize: FONT_SIZE.md,
    ...globalStyles.text
  },
  accountName: {
    fontSize: FONT_SIZE.md,
    ...globalStyles.textMedium
  },
  balanceInfo: {
    alignItems: 'flex-end'
  },
  balance: {
    ...globalStyles.textMedium
  },
  content: {
    maxHeight: WINDOW_HEIGHT * 0.5
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 16,
    gap: 16
  },
  title: {
    textAlign: 'center',
    fontSize: FONT_SIZE.xl * 1.2,
    ...globalStyles.textMedium
  },
  subtitle: {
    textAlign: 'center',
    color: 'gray',
    fontSize: FONT_SIZE.md,
    ...globalStyles.text
  },
  label: {
    color: 'gray',
    fontSize: FONT_SIZE.md,
    ...globalStyles.text
  },
  messageContainer: {
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0'
  },
  messageLabel: {
    fontSize: FONT_SIZE.lg,
    ...globalStyles.textMedium
  },
  message: {
    color: 'gray',
    fontSize: FONT_SIZE.md,
    ...globalStyles.text
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12
  },
  rejectButton: {
    width: '50%'
  },
  signButton: {
    width: '50%',
    borderRadius: 0
  }
});
