import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Surface, Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import { useToast } from 'react-native-toast-notifications';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import { Account } from '../../store/reducers/Accounts';
import { Network } from '../../store/reducers/Networks';
import globalStyles from '../../styles/globalStyles';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function ReceiveModal({ modal: { closeModal } }: Props) {
  const connectedAccount: Account = useAccount();
  const connectedNetwork: Network = useNetwork();

  const toast = useToast();

  const copyAddress = () => {
    Clipboard.setString(connectedAccount.address);
    toast.show('Copied to clipboard', { type: 'success' });
  };

  const shareAddress = async () => {
    try {
      await Share.open({ message: connectedAccount.address });
    } catch (error) {
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Receive {connectedNetwork.currencySymbol}
        </Text>
        <Ionicons
          name="close-outline"
          size={FONT_SIZE['xl'] * 1.7}
          onPress={closeModal}
        />
      </View>

      <View style={styles.content}>
        <QRCode value={connectedAccount.address} size={240} />
        <Text variant="titleLarge" style={styles.address}>
          {connectedAccount.address}
        </Text>
      </View>

      <Surface style={styles.warning} elevation={0}>
        <Text variant="bodyMedium" style={styles.warningText}>
          Send only {connectedNetwork.name} ({connectedNetwork.currencySymbol})
          to this address. Sending any other coins may result in permanent loss.
        </Text>
      </Surface>

      <View style={styles.buttonContainer}>
        <View style={styles.actionButton}>
          <IconButton
            icon={() => (
              <Ionicons name="copy-outline" size={24} color={COLORS.primary} />
            )}
            mode="contained"
            containerColor={COLORS.primaryLight}
            size={48}
            onPress={copyAddress}
          />
          <Text variant="titleMedium" style={styles.actionText}>
            Copy
          </Text>
        </View>

        <View style={styles.actionButton}>
          <IconButton
            icon={() => (
              <Ionicons
                name="paper-plane-outline"
                size={24}
                color={COLORS.primary}
              />
            )}
            mode="contained"
            containerColor={COLORS.primaryLight}
            size={48}
            onPress={shareAddress}
          />
          <Text variant="titleMedium" style={styles.actionText}>
            Share
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    margin: 20,
    width: WINDOW_WIDTH * 0.9
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  headerTitle: {
    fontSize: FONT_SIZE['xl'],
    ...globalStyles.textMedium
  },
  content: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 20
  },
  address: {
    textAlign: 'center',
    ...globalStyles.text
  },
  warning: {
    backgroundColor: COLORS.primaryLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20
  },
  warningText: {
    textAlign: 'center',
    fontSize: FONT_SIZE['md'],
    ...globalStyles.text
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40
  },
  buttonContent: {
    flexDirection: 'column',
    height: 80
  },
  actionButton: {
    alignItems: 'center'
  },
  actionText: {
    marginTop: 8,
    ...globalStyles.textMedium
  }
});
