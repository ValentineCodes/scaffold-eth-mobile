import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  IconButton,
  Modal,
  Portal,
  Surface,
  Text
} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import { Account } from '../../store/reducers/Accounts';
import { Network } from '../../store/reducers/Networks';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export default function ReceiveModal({ isVisible, onClose }: Props) {
  const connectedAccount: Account = useSelector(state =>
    state.accounts.find((account: Account) => account.isConnected)
  );
  const connectedNetwork: Network = useSelector((state: any) =>
    state.networks.find((network: Network) => network.isConnected)
  );

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
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text variant="headlineMedium">
            Receive {connectedNetwork.currencySymbol}
          </Text>
          <IconButton icon="close" onPress={onClose} />
        </View>

        <View style={styles.content}>
          <QRCode value={connectedAccount.address} size={240} />
          <Text variant="titleLarge" style={styles.address}>
            {connectedAccount.address}
          </Text>
        </View>

        <Surface style={styles.warning} elevation={0}>
          <Text variant="bodyMedium" style={styles.warningText}>
            Send only {connectedNetwork.name} ({connectedNetwork.currencySymbol}
            ) to this address. Sending any other coins may result in permanent
            loss.
          </Text>
        </Surface>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained-tonal"
            onPress={copyAddress}
            icon="content-copy"
            contentStyle={styles.buttonContent}
          >
            Copy
          </Button>

          <Button
            mode="contained-tonal"
            onPress={shareAddress}
            icon="share"
            contentStyle={styles.buttonContent}
          >
            Share
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    margin: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  content: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 20
  },
  address: {
    textAlign: 'center'
  },
  warning: {
    backgroundColor: COLORS.primaryLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20
  },
  warningText: {
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40
  },
  buttonContent: {
    flexDirection: 'column',
    height: 80
  }
});
