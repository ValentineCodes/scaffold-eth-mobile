import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, TextInput } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useAccount, useSecureStorage } from '../../hooks/scaffold-eth';
import { Account } from '../../store/reducers/Accounts';
import globalStyles from '../../styles/globalStyles';
import { Security } from '../../types/security';
import { Wallet } from '../../types/wallet';
import { COLORS } from '../../utils/constants';
import { truncateAddress } from '../../utils/helperFunctions';
import { FONT_SIZE, WINDOW_WIDTH } from '../../utils/styles';
import Button from '../buttons/CustomButton';
import Blockie from '../scaffold-eth/Blockie';

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function PrivateKeyModal({ modal: { closeModal } }: Props) {
  const connectedAccount: Account = useAccount();

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

    const security = (await getItem('security')) as Security;

    if (password !== security.password) {
      setError('Incorrect password!');
      return;
    }

    const accounts = (await getItem('accounts')) as Wallet[];
    const wallet = Array.from(accounts).find(
      wallet => wallet.address === connectedAccount.address
    );

    setPrivateKey(wallet!.privateKey);
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
    closeModal();
    setPrivateKey('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={globalStyles.textMedium}>
          Show private key
        </Text>
        <Ionicons
          name="close-outline"
          size={FONT_SIZE['xl'] * 1.7}
          onPress={handleOnClose}
        />
      </View>

      <View style={styles.accountInfo}>
        <Blockie address={connectedAccount.address} size={2.5 * FONT_SIZE.xl} />
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
        <Surface style={styles.privateKeyContainer}>
          <Text style={styles.privateKeyText}>{privateKey}</Text>
          <Ionicons
            name="copy-outline"
            onPress={copyPrivateKey}
            color={COLORS.primary}
            size={FONT_SIZE['xl']}
          />
        </Surface>
      ) : (
        <View style={styles.passwordContainer}>
          <Text variant="titleMedium" style={globalStyles.textMedium}>
            Enter your password
          </Text>
          <TextInput
            value={password}
            onChangeText={handleInputChange}
            onSubmitEditing={showPrivateKey}
            mode="outlined"
            secureTextEntry
            placeholder="Password"
            error={!!error}
            outlineStyle={{ borderRadius: 12, borderColor: COLORS.gray }}
            contentStyle={globalStyles.text}
          />
          {error && (
            <Text variant="bodySmall" style={styles.errorText}>
              {error}
            </Text>
          )}
        </View>
      )}

      <Surface style={styles.warningContainer}>
        <Ionicons name="eye-off" size={24} color={COLORS.error} />
        <Text style={styles.warningText}>
          Never disclose this key. Anyone with your private key can fully
          control your account, including transferring away any of your funds.
        </Text>
      </Surface>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    margin: 20,
    width: WINDOW_WIDTH * 0.9,
    elevation: 5
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
    marginTop: 10,
    ...globalStyles.textMedium
  },
  addressContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 15,
    marginTop: 5
  },
  addressText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    ...globalStyles.textMedium
  },
  privateKeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'white'
  },
  privateKeyText: {
    flex: 1,
    marginRight: 10,
    ...globalStyles.text,
    fontSize: FONT_SIZE['lg']
  },
  passwordContainer: {
    gap: 8,
    marginBottom: 20
  },
  errorText: {
    color: COLORS.error,
    ...globalStyles.text
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.lightRed,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    ...globalStyles.text
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
