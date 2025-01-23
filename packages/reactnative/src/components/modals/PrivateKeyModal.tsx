import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import { useSecureStorage } from '../../hooks/useSecureStorage';
import { Account } from '../../store/reducers/Accounts';
import { COLORS } from '../../utils/constants';
import { truncateAddress } from '../../utils/helperFunctions';
import { FONT_SIZE } from '../../utils/styles';
import Blockie from '../Blockie';
import Button from '../Button';
import CopyableText from '../CopyableText';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export default function PrivateKeyModal({ isVisible, onClose }: Props) {
  const connectedAccount: Account = useSelector(state =>
    state.accounts.find((account: Account) => account.isConnected)
  );

  const { getItem } = useSecureStorage();
  const toast = useToast();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const showPrivateKey = async () => {
    if (!password) {
      setError('Password cannot be empty');
      return;
    }

    const security = await getItem('security');

    if (password !== security.password) {
      setError('Incorrect password!');
      return;
    }

    const accounts = await getItem('accounts');
    const wallet = Array.from(accounts).find(
      wallet => wallet.address === connectedAccount.address
    );

    setPrivateKey(wallet.privateKey);
  };

  const handleInputChange = (value: string) => {
    setPassword(value);
    if (error) {
      setError('');
    }
  };

  const copyPrivateKey = () => {
    Clipboard.setString(privateKey);
    toast.show('Copied to clipboard', {
      type: 'success'
    });
  };

  const handleOnClose = () => {
    onClose();
    setPrivateKey('');
    setPassword('');
  };

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={handleOnClose}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text variant="titleLarge">Show private key</Text>
          <IconButton icon="close" onPress={handleOnClose} />
        </View>

        <View style={styles.accountInfo}>
          <Blockie
            address={connectedAccount.address}
            size={2.5 * FONT_SIZE.xl}
          />
          <Text variant="titleMedium" style={styles.accountName}>
            {connectedAccount.name}
          </Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {truncateAddress(connectedAccount.address)}
            </Text>
          </View>
        </View>

        {privateKey ? (
          <View style={styles.privateKeyContainer}>
            <Text style={styles.privateKeyText}>{privateKey}</Text>
            <IconButton
              icon="content-copy"
              onPress={copyPrivateKey}
              iconColor={COLORS.primary}
            />
          </View>
        ) : (
          <View style={styles.passwordContainer}>
            <Text variant="titleMedium">Enter your password</Text>
            <TextInput
              value={password}
              onChangeText={handleInputChange}
              onSubmitEditing={showPrivateKey}
              mode="outlined"
              secureTextEntry
              placeholder="Password"
              error={!!error}
            />
            {error && (
              <Text variant="bodySmall" style={styles.errorText}>
                {error}
              </Text>
            )}
          </View>
        )}

        <View style={styles.warningContainer}>
          <IconButton icon="eye-off" size={24} iconColor="red" />
          <Text style={styles.warningText}>
            Never disclose this key. Anyone with your private key can fully
            control your account, including transferring away any of your funds.
          </Text>
        </View>

        {privateKey ? (
          <Button text="Done" onPress={handleOnClose} />
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              type="outline"
              text="Cancel"
              onPress={handleOnClose}
              style={styles.cancelButton}
            />
            <Button
              text="Reveal"
              onPress={showPrivateKey}
              style={styles.revealButton}
            />
          </View>
        )}
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
  accountInfo: {
    alignItems: 'center',
    marginBottom: 20
  },
  accountName: {
    marginTop: 10
  },
  addressContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 15,
    marginTop: 5
  },
  addressText: {
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
    color: COLORS.primary
  },
  privateKeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20
  },
  privateKeyText: {
    flex: 1,
    marginRight: 10
  },
  passwordContainer: {
    gap: 8,
    marginBottom: 20
  },
  errorText: {
    color: 'red'
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffebee',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20
  },
  warningText: {
    flex: 1,
    marginLeft: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16
  },
  cancelButton: {
    flex: 1
  },
  revealButton: {
    flex: 1
  }
});
